const Groq = require('groq-sdk');
const Loan = require('../models/loanModel');
const LoanApplication = require('../models/loanApplicationModel');
const User = require('../models/userModel');

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ==================== DAILY USAGE LIMITER ====================
const DAILY_LIMIT = 10; // max queries per day for regular users
const usageTracker = new Map(); // userId -> { count, date }

function getUserUsage(userId) {
    const today = new Date().toDateString();
    const record = usageTracker.get(userId);
    if (!record || record.date !== today) {
        // Reset for new day
        usageTracker.set(userId, { count: 0, date: today });
        return { count: 0, remaining: DAILY_LIMIT };
    }
    return { count: record.count, remaining: Math.max(0, DAILY_LIMIT - record.count) };
}

function incrementUsage(userId) {
    const today = new Date().toDateString();
    const record = usageTracker.get(userId) || { count: 0, date: today };
    if (record.date !== today) {
        usageTracker.set(userId, { count: 1, date: today });
    } else {
        record.count += 1;
        usageTracker.set(userId, record);
    }
}
// =============================================================

/**
 * Gather live database context for the AI
 */
async function getDatabaseContext(userId, userRole) {
    const context = {};

    try {
        // Get all available loans
        const loans = await Loan.find({ isActive: true });
        context.availableLoans = loans.map(l => ({
            name: l.loanType,
            category: l.category,
            description: l.description,
            interestRate: l.interestRate + '%',
            maxAmount: '₹' + l.maximumAmount.toLocaleString('en-IN')
        }));
        context.totalLoans = loans.length;

        if (userRole === 'user' && userId) {
            // Get this user's applications
            const myApps = await LoanApplication.find({ userId, isActive: true });
            context.myApplications = myApps.map(a => ({
                loanType: a.loanType,
                status: a.loanStatus === 0 ? 'Pending' : a.loanStatus === 1 ? 'Approved' : 'Rejected',
                income: '₹' + a.income.toLocaleString('en-IN'),
                purchasePrice: '₹' + a.purchasePrice.toLocaleString('en-IN'),
                submissionDate: a.submissionDate ? new Date(a.submissionDate).toLocaleDateString('en-IN') : 'N/A',
                address: a.address
            }));
            context.totalMyApplications = myApps.length;
            context.pendingApplications = myApps.filter(a => a.loanStatus === 0).length;
            context.approvedApplications = myApps.filter(a => a.loanStatus === 1).length;
            context.rejectedApplications = myApps.filter(a => a.loanStatus === 2).length;
        }

        if (userRole === 'admin') {
            // Admin gets full stats
            const totalUsers = await User.countDocuments({ role: 'user', isActive: true });
            const allApps = await LoanApplication.find({ isActive: true });
            context.totalUsers = totalUsers;
            context.totalApplications = allApps.length;
            context.pendingApplications = allApps.filter(a => a.loanStatus === 0).length;
            context.approvedApplications = allApps.filter(a => a.loanStatus === 1).length;
            context.rejectedApplications = allApps.filter(a => a.loanStatus === 2).length;
            context.recentApplications = allApps.slice(-5).map(a => ({
                userName: a.userName,
                loanType: a.loanType,
                status: a.loanStatus === 0 ? 'Pending' : a.loanStatus === 1 ? 'Approved' : 'Rejected',
                purchasePrice: '₹' + a.purchasePrice.toLocaleString('en-IN')
            }));
        }
    } catch (err) {
        console.error('Error gathering DB context:', err.message);
    }

    return context;
}

/**
 * Build the system prompt
 */
function buildSystemPrompt(userRole, userName, dbContext) {
    return `You are "Loan Assistant", a helpful AI chatbot for VehicleLoanHub — a vehicle loan management platform.

ROLE OF THE CURRENT USER: ${userRole}
USER NAME: ${userName || 'Unknown'}

LIVE DATABASE INFORMATION:
${JSON.stringify(dbContext, null, 2)}

INSTRUCTIONS:
- You answer questions about vehicle loans, the platform, loan applications, interest rates, eligibility, and more.
- Use the LIVE DATABASE INFORMATION above to answer factual questions (e.g., how many loans exist, what loans are available, application status, etc.).
- If the user is a "user", help them understand their loan applications, guide them to apply, and answer loan-related questions.
- If the user is an "admin", help them with platform stats, user management insights, and loan application overviews.
- Be friendly, concise, and professional. Use emojis sparingly for warmth.
- Format responses cleanly. Use bullet points or numbered lists when listing items.
- If you don't know something or it's not in the data, say so honestly.
- Never reveal raw database IDs, passwords, or sensitive internal data.
- Keep answers under 200 words unless the user asks for detailed information.
- Respond in the tone matching the user's language (casual or formal).`;
}

/**
 * GET /chatbot?q=<query>
 * AI-Powered chatbot endpoint using Groq
 */
const chatbotQuery = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.json({
                message: "👋 Hello! I'm your Vehicle Loan Assistant. Ask me anything about vehicle loans, interest rates, your applications, or the platform!",
                type: 'greeting',
                suggestions: [
                    "What loans are available?",
                    "What's the interest rate?",
                    "How many loans are there?",
                    "Show my application status",
                    "How do I apply for a loan?"
                ]
            });
        }

        const query = q.trim();

        // Get user info from the token
        const userId = req.userId;
        let userRole = 'user';
        let userName = 'User';

        try {
            const user = await User.findById(userId);
            if (user) {
                userRole = user.role;
                userName = user.userName;
            }
        } catch (e) {
            // userId might not be a valid ObjectId, continue with defaults
        }

        // Enforce daily usage limit for regular users (admins are unlimited)
        if (userRole !== 'admin') {
            const usage = getUserUsage(userId);
            if (usage.remaining <= 0) {
                return res.json({
                    message: `⚠️ You've reached your daily limit of ${DAILY_LIMIT} messages. Your quota resets tomorrow. Upgrade to admin for unlimited access!`,
                    type: 'limit',
                    remaining: 0,
                    dailyLimit: DAILY_LIMIT
                });
            }
        }

        // Gather live database context
        const dbContext = await getDatabaseContext(userId, userRole);

        // Build system prompt
        const systemPrompt = buildSystemPrompt(userRole, userName, dbContext);

        // Call Groq API (using Llama 3.3 70B - fast and smart)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: query }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 500,
        });

        const aiText = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        // Increment usage for regular users after successful response
        if (userRole !== 'admin') {
            incrementUsage(userId);
        }

        const usage = userRole !== 'admin' ? getUserUsage(userId) : { remaining: -1 };

        return res.json({
            message: aiText,
            type: 'answer',
            confidence: 'high',
            remaining: usage.remaining,
            dailyLimit: userRole !== 'admin' ? DAILY_LIMIT : null
        });

    } catch (error) {
        console.error('Chatbot error:', error);

        // Fallback for API errors
        if (error.status === 429) {
            return res.json({
                message: "⚠️ AI service is temporarily busy. Please try again in a moment.",
                type: 'error',
                confidence: 'low'
            });
        }

        return res.status(500).json({
            message: '⚠️ Something went wrong. Please try again.',
            type: 'error'
        });
    }
};

// ==================== ADMIN FAQ CRUD ====================
const FAQ = require('../models/faqModel');
const { generateEmbedding } = require('../utils/embeddingUtils');

const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch FAQs' });
    }
};

const getFAQById = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch FAQ' });
    }
};

const addFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });
        const embedding = generateEmbedding(question);
        const faq = new FAQ({ question, answer, category: category || 'general', embedding });
        await faq.save();
        res.status(201).json({ message: 'FAQ added successfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add FAQ' });
    }
};

const updateFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        if (question) { faq.question = question; faq.embedding = generateEmbedding(question); }
        if (answer) faq.answer = answer;
        if (category) faq.category = category;
        await faq.save();
        res.json({ message: 'FAQ updated successfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update FAQ' });
    }
};

const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq || !faq.isActive) return res.status(404).json({ message: 'FAQ not found' });
        faq.isActive = false;
        await faq.save();
        res.json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete FAQ' });
    }
};

const seedFAQs = async (req, res) => {
    try {
        const defaultFAQs = [
            { question: "What types of vehicle loans are available?", answer: "We offer Car Loans, Two-Wheeler Loans, Commercial Vehicle Loans, and Electric Vehicle Loans.", category: "loan-types" },
            { question: "What is the interest rate for vehicle loans?", answer: "Rates vary: Car Loans from 7.5%, Two-Wheeler from 8.5%, Commercial from 9%, EV from 7%.", category: "interest-rates" },
            { question: "What documents are required?", answer: "ID Proof, Address Proof, Income Proof, Bank Statements, Vehicle quotation, and photographs.", category: "documents" },
            { question: "How do I apply for a loan?", answer: "Log in → View All Loans → Select loan → Click Apply → Fill form → Submit.", category: "application" },
            { question: "What is the eligibility criteria?", answer: "Age 21-65, min income ₹15,000/month, 1 year work experience, credit score 650+.", category: "eligibility" },
        ];
        const faqsWithEmbeddings = defaultFAQs.map(faq => ({ ...faq, embedding: generateEmbedding(faq.question) }));
        await FAQ.deleteMany({});
        await FAQ.insertMany(faqsWithEmbeddings);
        res.json({ message: `Seeded ${faqsWithEmbeddings.length} FAQs`, count: faqsWithEmbeddings.length });
    } catch (error) {
        res.status(500).json({ message: 'Failed to seed FAQs' });
    }
};

module.exports = { chatbotQuery, getAllFAQs, getFAQById, addFAQ, updateFAQ, deleteFAQ, seedFAQs };

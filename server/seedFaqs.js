const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const FAQ = require('./models/faqModel');
const { generateEmbedding } = require('./utils/embeddingUtils');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_loan_hub';

const defaultFAQs = [
    { question: "What types of vehicle loans are available?", answer: "We offer several types of vehicle loans including: Car Loans (new and used), Two-Wheeler Loans, Commercial Vehicle Loans, and Electric Vehicle Loans. Each type has different interest rates and terms tailored to your needs.", category: "loan-types" },
    { question: "What is the interest rate for vehicle loans?", answer: "Our interest rates vary by loan type: Car Loans start from 7.5% p.a., Two-Wheeler Loans from 8.5% p.a., Commercial Vehicle Loans from 9% p.a., and Electric Vehicle Loans from 7% p.a. Actual rates depend on your credit score, loan amount, and tenure.", category: "interest-rates" },
    { question: "What documents are required for a vehicle loan?", answer: "Required documents include: Valid ID Proof (Aadhar/PAN/Passport), Address Proof, Income Proof (salary slips for last 3 months or ITR for self-employed), Bank Statements (last 6 months), Vehicle quotation from the dealer, and passport-sized photographs.", category: "documents" },
    { question: "What is the maximum loan amount I can get?", answer: "The maximum loan amount depends on the vehicle type and your eligibility. Generally, we finance up to 90% of the on-road price for new vehicles and up to 75% for used vehicles. The exact amount is determined based on your income, credit score, and repayment capacity.", category: "eligibility" },
    { question: "How do I apply for a vehicle loan?", answer: "You can apply for a vehicle loan in 3 easy steps: 1) Log in to your account and go to 'View All Loans' to browse available options. 2) Select your preferred loan and click 'Apply'. 3) Fill in the application form with your details and submit. Our team will review and process your application within 2-3 business days.", category: "application" },
    { question: "What is the loan tenure period?", answer: "Loan tenure ranges from 1 to 7 years depending on the loan type. Car loans typically have a tenure of 1-7 years, two-wheeler loans 1-5 years, and commercial vehicle loans 1-5 years. You can choose an EMI plan that suits your budget.", category: "tenure" },
    { question: "Can I prepay or close my loan early?", answer: "Yes, you can prepay or foreclose your vehicle loan. After completing 6 months of regular EMI payments, you can make a prepayment without any charges. Full loan closure is allowed after 12 months with minimal foreclosure charges as per RBI guidelines.", category: "prepayment" },
    { question: "What is the eligibility criteria for a vehicle loan?", answer: "Eligibility criteria include: Age between 21-65 years, minimum monthly income of ₹15,000 (salaried) or ₹2,00,000 annual income (self-employed), at least 1 year of work experience, and a good credit score (650+). Both salaried and self-employed individuals can apply.", category: "eligibility" },
    { question: "How can I check my loan application status?", answer: "You can check your loan application status by logging into your account and navigating to 'Applied Loans' section. Here you'll see the real-time status of all your loan applications including: Pending, Under Review, Approved, or Rejected, along with any comments from our team.", category: "status" },
    { question: "What happens if I miss an EMI payment?", answer: "Missing an EMI payment may result in late payment charges and can affect your credit score. If you anticipate difficulty in making a payment, please contact our support team in advance. We may be able to offer a revised payment schedule or a brief grace period.", category: "payments" }
];

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const faqsWithEmbeddings = defaultFAQs.map(faq => ({
        ...faq,
        embedding: generateEmbedding(faq.question)
    }));

    await FAQ.deleteMany({});
    await FAQ.insertMany(faqsWithEmbeddings);
    console.log(`Seeded ${faqsWithEmbeddings.length} FAQs successfully!`);

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

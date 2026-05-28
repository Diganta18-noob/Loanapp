const express = require('express');
const router = express.Router();
const { validateToken, requireAdmin } = require('../middleware/authUtils');
const {
    chatbotQuery,
    getAllFAQs,
    getFAQById,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    seedFAQs
} = require('../controllers/chatbotController');

// ==================== User Routes ====================
// GET /chatbot?q=<query> — Chatbot query endpoint
router.get('/', validateToken, chatbotQuery);

// ==================== Admin FAQ Routes ====================
// GET /chatbot/faqs — Get all FAQs
router.get('/faqs', validateToken, requireAdmin, getAllFAQs);

// GET /chatbot/faqs/:id — Get single FAQ
router.get('/faqs/:id', validateToken, requireAdmin, getFAQById);

// POST /chatbot/faqs — Add new FAQ
router.post('/faqs', validateToken, requireAdmin, addFAQ);

// PUT /chatbot/faqs/:id — Update FAQ
router.put('/faqs/:id', validateToken, requireAdmin, updateFAQ);

// DELETE /chatbot/faqs/:id — Delete FAQ
router.delete('/faqs/:id', validateToken, requireAdmin, deleteFAQ);

// POST /chatbot/faqs/seed — Seed default FAQs
router.post('/faqs/seed', validateToken, requireAdmin, seedFAQs);

module.exports = router;

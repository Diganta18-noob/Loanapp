const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authUtils');
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
router.get('/faqs', validateToken, getAllFAQs);

// GET /chatbot/faqs/:id — Get single FAQ
router.get('/faqs/:id', validateToken, getFAQById);

// POST /chatbot/faqs — Add new FAQ
router.post('/faqs', validateToken, addFAQ);

// PUT /chatbot/faqs/:id — Update FAQ
router.put('/faqs/:id', validateToken, updateFAQ);

// DELETE /chatbot/faqs/:id — Delete FAQ
router.delete('/faqs/:id', validateToken, deleteFAQ);

// POST /chatbot/faqs/seed — Seed default FAQs
router.post('/faqs/seed', validateToken, seedFAQs);

module.exports = router;

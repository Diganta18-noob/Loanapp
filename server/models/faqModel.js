const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    embedding: {
        type: [Number],
        default: []
    },
    category: {
        type: String,
        default: 'general',
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Text index for text-based similarity search
faqSchema.index({ question: 'text', answer: 'text' });

module.exports = mongoose.model('FAQ', faqSchema);

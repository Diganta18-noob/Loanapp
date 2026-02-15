const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    loanType: {
        type: String,
        required: true,
        index: 'text',
    },
    category: {
        type: String,
        required: true,
        enum: ['Two Wheeler', 'Four Wheeler', 'Commercial Vehicle', 'Electric Vehicle', 'Used Vehicle', 'Other'],
        default: 'Four Wheeler',
    },
    description: {
        type: String,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    maximumAmount: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;

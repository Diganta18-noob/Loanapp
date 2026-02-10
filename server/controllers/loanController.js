const Loan = require('../models/loanModel');
const { createAuditLog } = require('./auditLogController');

// Get all loans
const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find({});
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan by ID
const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new loan
const addLoan = async (req, res) => {
    try {
        const loan = await Loan.create(req.body);
        await createAuditLog({
            userId: req.userId, userName: 'Admin',
            action: 'CREATE', entity: 'Loan', entityId: loan._id.toString(),
            details: `Created loan: ${req.body.loanType} (${req.body.category})`,
            ipAddress: req.ip,
        });
        res.status(200).json({ message: 'Loan added Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing loan
const updateLoan = async (req, res) => {
    try {
        const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        await createAuditLog({
            userId: req.userId, userName: 'Admin',
            action: 'UPDATE', entity: 'Loan', entityId: req.params.id,
            details: `Updated loan: ${loan.loanType}`,
            ipAddress: req.ip,
        });
        res.status(200).json({ message: 'Loan updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a loan
const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findByIdAndDelete(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        await createAuditLog({
            userId: req.userId, userName: 'Admin',
            action: 'DELETE', entity: 'Loan', entityId: req.params.id,
            details: `Deleted loan: ${loan.loanType}`,
            ipAddress: req.ip,
        });
        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllLoans, getLoanById, addLoan, updateLoan, deleteLoan };

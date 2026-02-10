const LoanApplication = require('../models/loanApplicationModel');
const { createAuditLog } = require('./auditLogController');

// Get all loan applications with pagination, search, and sorting
const getAllLoanApplications = async (req, res) => {
    try {
        const { searchValue, statusFilter, sortOrder, pageNo, pageSize, sortBy } = req.body;

        let searchQuery = {};

        if (searchValue) {
            searchQuery.$or = [
                { userName: { $regex: searchValue, $options: 'i' } },
                { loanType: { $regex: searchValue, $options: 'i' } },
            ];
        }

        if (statusFilter !== undefined && statusFilter !== null && statusFilter !== '') {
            searchQuery.loanStatus = Number(statusFilter);
        }

        const sortObj = {};
        sortObj[sortBy || 'submissionDate'] = sortOrder === 1 ? 1 : -1;

        const skip = ((pageNo || 1) - 1) * (pageSize || 10);
        const limit = pageSize || 10;

        const data = await LoanApplication.find(searchQuery)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        const total = await LoanApplication.countDocuments(searchQuery);

        res.status(200).json({ data, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan applications by user ID
const getLoanApplicationsByUserId = async (req, res) => {
    try {
        const applications = await LoanApplication.find({ userId: req.params.userId });
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get loan application by ID
const getLoanApplicationById = async (req, res) => {
    try {
        const application = await LoanApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new loan application (with Multer file upload)
const addLoanApplication = async (req, res) => {
    try {
        const appData = { ...req.body };
        if (req.file) {
            appData.file = req.file.filename;
        }
        const app = await LoanApplication.create(appData);
        await createAuditLog({
            userId: req.body.userId, userName: req.body.userName,
            action: 'CREATE', entity: 'LoanApplication', entityId: app._id.toString(),
            details: `Applied for ${req.body.loanType} loan`,
            ipAddress: req.ip,
        });
        res.status(200).json({ message: 'Added Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing loan application
const updateLoanApplication = async (req, res) => {
    try {
        const application = await LoanApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        const statusLabel = req.body.loanStatus === 1 ? 'Approved' : req.body.loanStatus === 2 ? 'Rejected' : 'Updated';
        await createAuditLog({
            userId: req.userId, userName: 'Admin',
            action: 'UPDATE', entity: 'LoanApplication', entityId: req.params.id,
            details: `Application ${statusLabel} for ${application.userName}`,
            ipAddress: req.ip,
        });
        res.status(200).json({ message: 'Updated Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a loan application
const deleteLoanApplication = async (req, res) => {
    try {
        const application = await LoanApplication.findByIdAndDelete(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Loan application not found' });
        }
        await createAuditLog({
            userId: req.userId, userName: application.userName,
            action: 'DELETE', entity: 'LoanApplication', entityId: req.params.id,
            details: `Deleted ${application.loanType} application`,
            ipAddress: req.ip,
        });
        res.status(200).json({ message: 'Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllLoanApplications,
    getLoanApplicationsByUserId,
    getLoanApplicationById,
    addLoanApplication,
    updateLoanApplication,
    deleteLoanApplication,
};

const AuditLog = require('../models/auditLogModel');

// Helper to create audit log entries (call from other controllers)
const createAuditLog = async ({ userId, userName, action, entity, entityId, details, ipAddress }) => {
    try {
        await AuditLog.create({ userId, userName, action, entity, entityId, details, ipAddress });
    } catch (error) {
        console.error('Audit log error:', error.message);
    }
};

// Get all audit logs with pagination
const getAuditLogs = async (req, res) => {
    try {
        const { pageNo = 1, pageSize = 15, entity, userId } = req.body;
        const query = {};
        if (entity) query.entity = entity;
        if (userId) query.userId = userId;

        const skip = (pageNo - 1) * pageSize;
        const data = await AuditLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(pageSize);
        const total = await AuditLog.countDocuments(query);
        res.status(200).json({ data, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createAuditLog, getAuditLogs };

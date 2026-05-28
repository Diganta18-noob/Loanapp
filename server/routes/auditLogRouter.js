const express = require('express');
const router = express.Router();
const { validateToken, requireAdmin } = require('../middleware/authUtils');
const { getAuditLogs } = require('../controllers/auditLogController');

router.post('/getAll', validateToken, requireAdmin, getAuditLogs);

module.exports = router;

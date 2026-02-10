const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authUtils');
const { getAuditLogs } = require('../controllers/auditLogController');

router.post('/getAll', validateToken, getAuditLogs);

module.exports = router;

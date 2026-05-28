const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
};

const validateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication failed - No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed - Invalid token format' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired - Please login again' });
        }
        return res.status(401).json({ message: 'Authentication failed - Invalid token' });
    }
};

const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden - Admin access required' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error during authorization' });
    }
};

module.exports = { generateToken, validateToken, requireAdmin };

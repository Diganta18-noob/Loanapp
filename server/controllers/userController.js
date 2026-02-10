const User = require('../models/userModel');
const { generateToken } = require('../middleware/authUtils');

// Login user
const getUserByEmailAndPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = generateToken(user._id);
        const response = {
            userName: user.userName,
            role: user.role,
            token: token,
            id: user._id,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register user
const addUser = async (req, res) => {
    try {
        await User.create(req.body);
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(500).json({ message: error.message });
    }
};

// Check duplicate field (userName / email / mobile)
const checkDuplicate = async (req, res) => {
    try {
        const { field, value } = req.body;
        if (!field || !value) return res.status(200).json({ exists: false });

        const allowed = ['userName', 'email', 'mobile'];
        if (!allowed.includes(field)) return res.status(400).json({ message: 'Invalid field' });

        const query = {};
        query[field] = value;
        const user = await User.findOne(query).select('_id');
        res.status(200).json({ exists: !!user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUserByEmailAndPassword, addUser, checkDuplicate };

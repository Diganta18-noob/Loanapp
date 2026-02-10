const express = require('express');
const router = express.Router();
const { getUserByEmailAndPassword, addUser } = require('../controllers/userController');

router.post('/login', getUserByEmailAndPassword);
router.post('/register', addUser);

module.exports = router;

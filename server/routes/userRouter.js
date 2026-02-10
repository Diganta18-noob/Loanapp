const express = require('express');
const router = express.Router();
const { getUserByEmailAndPassword, addUser, checkDuplicate } = require('../controllers/userController');

router.post('/login', getUserByEmailAndPassword);
router.post('/register', addUser);
router.post('/checkDuplicate', checkDuplicate);

module.exports = router;

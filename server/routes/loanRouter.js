const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authUtils');
const {
    getAllLoans,
    getLoanById,
    addLoan,
    updateLoan,
    deleteLoan,
} = require('../controllers/loanController');

router.get('/getAll', getAllLoans);
router.get('/getById/:id', getLoanById);
router.post('/add', validateToken, addLoan);
router.put('/update/:id', validateToken, updateLoan);
router.delete('/delete/:id', validateToken, deleteLoan);

module.exports = router;

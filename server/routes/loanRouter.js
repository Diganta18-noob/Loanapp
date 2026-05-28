const express = require('express');
const router = express.Router();
const { validateToken, requireAdmin } = require('../middleware/authUtils');
const {
    getAllLoans,
    getLoanById,
    addLoan,
    updateLoan,
    deleteLoan,
} = require('../controllers/loanController');

router.get('/getAll', getAllLoans);
router.get('/getById/:id', getLoanById);
router.post('/add', validateToken, requireAdmin, addLoan);
router.put('/update/:id', validateToken, requireAdmin, updateLoan);
router.delete('/delete/:id', validateToken, requireAdmin, deleteLoan);

module.exports = router;

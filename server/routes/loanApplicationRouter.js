const express = require('express');
const router = express.Router();
const { validateToken } = require('../middleware/authUtils');
const {
    getAllLoanApplications,
    getLoanApplicationsByUserId,
    getLoanApplicationById,
    addLoanApplication,
    updateLoanApplication,
    deleteLoanApplication,
} = require('../controllers/loanApplicationController');

router.post('/getAllLoanApplications', validateToken, getAllLoanApplications);
router.get('/getLoanApplicationsByUserId/:userId', validateToken, getLoanApplicationsByUserId);
router.get('/getById/:id', validateToken, getLoanApplicationById);
router.post('/add', validateToken, addLoanApplication);
router.put('/update/:id', validateToken, updateLoanApplication);
router.delete('/delete/:id', validateToken, deleteLoanApplication);

module.exports = router;

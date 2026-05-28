const express = require('express');
const router = express.Router();
const { validateToken, requireAdmin } = require('../middleware/authUtils');
const upload = require('../middleware/multerConfig');
const {
    getAllLoanApplications,
    getLoanApplicationsByUserId,
    getLoanApplicationById,
    addLoanApplication,
    updateLoanApplication,
    deleteLoanApplication,
} = require('../controllers/loanApplicationController');

router.post('/getAllLoanApplications', validateToken, requireAdmin, getAllLoanApplications);
router.get('/getLoanApplicationsByUserId/:userId', validateToken, getLoanApplicationsByUserId);
router.get('/getById/:id', validateToken, getLoanApplicationById);
router.post('/add', validateToken, upload.single('file'), addLoanApplication);
router.put('/update/:id', validateToken, requireAdmin, updateLoanApplication);
router.delete('/delete/:id', validateToken, requireAdmin, deleteLoanApplication);

module.exports = router;

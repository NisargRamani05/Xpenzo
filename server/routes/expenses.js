const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    submitExpense, 
    getEmployeeExpenses, 
    getPendingExpensesForApprover,
    updateExpenseStatus,
    scanReceipt,
    getAllPendingExpenses,
    forceUpdateStatusByAdmin,
    getCompletedExpenses
} = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = multer({ dest: 'uploads/' });

// Employee & General Routes
router.post('/', auth, submitExpense);
router.get('/my-expenses', auth, getEmployeeExpenses);
router.post('/scan', [auth, upload.single('receipt')], scanReceipt);

// Approver Routes (Normal Flow)
router.get('/pending-for-me', auth, getPendingExpensesForApprover);
router.put('/:id/status', auth, updateExpenseStatus);

// Admin Override Routes
router.get('/all-pending', [auth, admin], getAllPendingExpenses);
router.put('/:id/force-status', [auth, admin], forceUpdateStatusByAdmin);

router.get('/completed', auth, getCompletedExpenses);

module.exports = router;
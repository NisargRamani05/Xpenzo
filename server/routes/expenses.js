const express = require('express');
const router = express.Router();
const { submitExpense, getEmployeeExpenses, getManagerPendingExpenses, updateExpenseStatus } = require('../controllers/expenseController');
const auth = require('../middleware/auth');
const multer = require('multer'); 
const { scanReceipt } = require('../controllers/expenseController');

const upload = multer({ dest: 'uploads/' });

// @route   POST /api/expenses
// @desc    Employee submits an expense
router.post('/', auth, submitExpense);

// @route   GET /api/expenses/my-expenses
// @desc    Employee gets their own expenses
router.get('/my-expenses', auth, getEmployeeExpenses);

// @route   GET /api/expenses/team-expenses
// @desc    Manager gets pending expenses for their team
router.get('/team-expenses', auth, getManagerPendingExpenses);

// @route   PUT /api/expenses/:id/status
// @desc    Manager updates expense status
router.put('/:id/status', auth, updateExpenseStatus);

// @route   POST /api/expenses/scan
// @desc    Upload a receipt and extract text with OCR
router.post('/scan', [auth, upload.single('receipt')], scanReceipt);

module.exports = router;
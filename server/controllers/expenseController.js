const Expense = require('../models/Expense');
const User = require('../models/User');
const axios = require('axios');
const Company = require('../models/Company');

// @desc    Employee submits a new expense claim
exports.submitExpense = async (req, res) => {
  try {
    const { amount, category, description, date, currency } = req.body; // <-- Add currency
    const newExpense = new Expense({
      amount, category, description, date, currency, // <-- Add currency
      submittedBy: req.user.id,
      company: req.user.company,
    });
    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Employee views their own expense history
exports.getEmployeeExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ submittedBy: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Manager views expenses waiting for their approval
exports.getManagerPendingExpenses = async (req, res) => {
  try {
    // Find all users who report to this manager
    const subordinates = await User.find({ manager: req.user.id }).select('_id');
    const subordinateIds = subordinates.map(user => user.id);

    // Find all pending expenses submitted by those users
    const expenses = await Expense.find({
      submittedBy: { $in: subordinateIds },
      status: 'Pending'
    }).populate('submittedBy', 'name email').sort({ date: 1 }); // Populate with submitter's info

    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Manager approves or rejects an expense
exports.updateExpenseStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        // TODO: Add extra validation to ensure the manager is authorized for this specific expense

        expense.status = status;
        expense.comments = comments;
        expense.approvedBy = req.user.id;

        await expense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
exports.getManagerPendingExpenses = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    const companyCurrency = company.defaultCurrency;

    const subordinates = await User.find({ manager: req.user.id }).select('_id');
    const subordinateIds = subordinates.map(user => user.id);

    const expenses = await Expense.find({
      submittedBy: { $in: subordinateIds },
      status: 'Pending'
    }).populate('submittedBy', 'name email').sort({ date: 1 }).lean(); // Use .lean() for plain JS objects

    // Live currency conversion
    for (const expense of expenses) {
        if (expense.currency !== companyCurrency) {
            const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${expense.currency}/${companyCurrency}/${expense.amount}`);
            expense.convertedAmount = response.data.conversion_result.toFixed(2);
            expense.companyCurrency = companyCurrency;
        } else {
            expense.convertedAmount = expense.amount;
            expense.companyCurrency = companyCurrency;
        }
    }

    res.json(expenses);
  } catch (err) {
    console.error("Conversion API Error:", err.message);
    res.status(500).send('Server Error');
  }
};
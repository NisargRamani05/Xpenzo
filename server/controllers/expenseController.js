const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Company = require('../models/Company');
const axios = require('axios');
const Tesseract = require('tesseract.js');

exports.scanReceipt = async (req, res) => {
    if (!req.file) { return res.status(400).json({ msg: 'No receipt image uploaded.' }); }
    try {
        const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
        let extractedAmount = null;
        const lines = text.split('\n');
        const totalLine = lines.find(line => line.toLowerCase().includes('total') || line.toLowerCase().includes('amount'));
        if (totalLine) {
            const match = totalLine.match(/(\d+\.\d{2})/);
            if (match) { extractedAmount = parseFloat(match[0]); }
        }
        res.json({ fullText: text, extractedAmount: extractedAmount });
    } catch (err) {
        console.error("OCR Error:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.submitExpense = async (req, res) => {
  try {
    const { amount, category, description, date, currency } = req.body;
    const submitter = await User.findById(req.user.id);
    if (!submitter) { return res.status(404).json({ msg: 'Submitter not found.' }); }
    const approvalPath = [];
    if (submitter.manager) {
        approvalPath.push({ approver: submitter.manager });
    } else {
        return res.status(400).json({ msg: 'You do not have a manager assigned. Cannot submit expense.' });
    }
    const admin = await User.findOne({ company: req.user.company, role: 'Admin' });
    if (admin) {
        if (String(admin._id) !== String(submitter.manager)) {
            approvalPath.push({ approver: admin._id });
        }
    } else {
         return res.status(400).json({ msg: 'No admin found in your company for final approval.' });
    }
    const newExpense = new Expense({
      amount, category, description, date, currency,
      submittedBy: req.user.id,
      company: req.user.company,
      approvalPath: approvalPath,
      currentApproverIndex: 0,
    });
    const expense = await newExpense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getEmployeeExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ submittedBy: req.user.id })
      .populate('approvalPath.approver', 'name')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPendingExpensesForApprover = async (req, res) => {
  try {
    const company = await Company.findById(req.user.company);
    const companyCurrency = company.defaultCurrency;
    const expenses = await Expense.find({
      status: 'Pending',
      $expr: {
        $and: [
          { $eq: [ { $arrayElemAt: ['$approvalPath.status', '$currentApproverIndex'] }, 'Pending' ] },
          { $eq: [ { $arrayElemAt: ['$approvalPath.approver', '$currentApproverIndex'] }, new mongoose.Types.ObjectId(req.user.id) ] }
        ]
      }
    }).populate('submittedBy', 'name email').sort({ date: 1 }).lean();
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
    console.error("Approval fetch/conversion Error:", err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateExpenseStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;
    const expense = await Expense.findById(req.params.id);
    if (!expense) { return res.status(404).json({ msg: 'Expense not found' }); }
    const currentApproverId = expense.approvalPath[expense.currentApproverIndex].approver;
    if (String(currentApproverId) !== req.user.id) {
        return res.status(403).json({ msg: 'Not authorized to approve this expense at this stage.' });
    }
    expense.approvalPath[expense.currentApproverIndex].status = status;
    expense.approvalPath[expense.currentApproverIndex].comments = comments;
    expense.approvalPath[expense.currentApproverIndex].actionDate = Date.now();
    if (status === 'Rejected') {
        expense.status = 'Rejected';
    } else {
        const isFinalApproval = expense.currentApproverIndex === expense.approvalPath.length - 1;
        if (isFinalApproval) {
            expense.status = 'Approved';
        } else {
            expense.currentApproverIndex += 1;
        }
    }
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllPendingExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ company: req.user.company, status: 'Pending' })
        .populate('submittedBy', 'name')
        .populate('approvalPath.approver', 'name')
        .sort({ createdAt: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.forceUpdateStatusByAdmin = async (req, res) => {
    try {
        const { status, comments } = req.body;
        const expense = await Expense.findById(req.params.id);
        if (!expense) { return res.status(404).json({ msg: 'Expense not found' }); }
        expense.status = status;
        const lastStep = expense.approvalPath[expense.approvalPath.length - 1];
        lastStep.comments = `Admin Override: ${comments}`;
        lastStep.actionDate = Date.now();
        await expense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all completed (Approved/Rejected) expenses for the company
exports.getCompletedExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ 
            company: req.user.company, 
            status: { $in: ['Approved', 'Rejected'] } 
        })
        .populate('submittedBy', 'name')
        .populate('approvalPath.approver', 'name') // To show names in the history modal
        .sort({ updatedAt: -1 }); // Sort by most recently completed

        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
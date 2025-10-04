const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  // Expense Submission (Employee Role)
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  // Amount, Category, Description, Date
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // View their expense history (Approved, Rejected)
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  // Approve/Reject with comments
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: { type: String }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Expense', ExpenseSchema);
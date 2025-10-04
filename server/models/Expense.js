const mongoose = require('mongoose');

const ApprovalStepSchema = new mongoose.Schema({
    approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    comments: { type: String },
    actionDate: { type: Date }
});

const ExpenseSchema = new mongoose.Schema({
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, uppercase: true, trim: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  
  // The overall status of the entire expense claim
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },

  // --- NEW FIELDS FOR MULTI-STEP APPROVAL ---
  approvalPath: [ApprovalStepSchema],
  currentApproverIndex: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
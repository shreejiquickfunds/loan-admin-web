const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  fromStatus: {
    type: String,
    default: null,
  },
  toStatus: {
    type: String,
    default: null,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const loanFileSchema = new mongoose.Schema({
  fileNumber: {
    type: String,
    required: [true, 'File number (MCF ID) is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true,
  },
  loanType: {
    type: String,
    required: [true, 'Loan type is required'],
    enum: ['Home Loan', 'Personal Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Gold Loan'],
  },
  amount: {
    type: Number,
    default: null,
    min: [0, 'Amount cannot be negative'],
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Login', 'Document Pending', 'Sanction', 'Disbursement'],
    default: 'Login',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timeline: [timelineEventSchema],
}, {
  timestamps: true,
});

// Index fileNumber for fast searching
loanFileSchema.index({ fileNumber: 1 });
loanFileSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('LoanFile', loanFileSchema);

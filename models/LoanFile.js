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
    required: true,
    unique: true,
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
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'Under Review', 'Under Process', 'Approved', 'Rejected', 'Completed'],
    default: 'New',
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

// Generate random file number before saving
loanFileSchema.pre('validate', function () {
  if (!this.fileNumber) {
    const prefix = 'LF';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.fileNumber = `${prefix}-${timestamp}-${random}`;
  }
});

module.exports = mongoose.model('LoanFile', loanFileSchema);

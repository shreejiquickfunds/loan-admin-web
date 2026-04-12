const express = require('express');
const LoanFile = require('../models/LoanFile');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/files - get files with search, filter & pagination
router.get('/', protect, async (req, res) => {
  try {
    const { search, status, assignedTo, page = 1, limit = 20 } = req.query;

    let query = {};

    // Search by applicant name or file number
    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { fileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status — 'All' returns everything (paginated)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by assigned sub-admin
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [files, total] = await Promise.all([
      LoanFile.find(query)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      LoanFile.countDocuments(query),
    ]);

    res.json({
      files,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/files/stats - get dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total           = await LoanFile.countDocuments();
    const login           = await LoanFile.countDocuments({ status: 'Login' });
    const docPending      = await LoanFile.countDocuments({ status: 'Document Pending' });
    const sanction        = await LoanFile.countDocuments({ status: 'Sanction' });
    const disbursement    = await LoanFile.countDocuments({ status: 'Disbursement' });

    res.json({ total, login, docPending, sanction, disbursement });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/files/:id - get single file with populated timeline
router.get('/:id', protect, async (req, res) => {
  try {
    const file = await LoanFile.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('timeline.performedBy', 'name email role');

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/files - create new file
router.post('/', protect, async (req, res) => {
  try {
    const { fileNumber, applicantName, loanType, assignedTo } = req.body;

    if (!fileNumber || !fileNumber.trim()) {
      return res.status(400).json({ message: 'File number (MCF ID) is required' });
    }

    // Check uniqueness manually for a clear error message
    const existing = await LoanFile.findOne({ fileNumber: fileNumber.trim().toUpperCase() });
    if (existing) {
      return res.status(409).json({ message: `File number "${fileNumber.trim().toUpperCase()}" already exists` });
    }

    const file = new LoanFile({
      fileNumber: fileNumber.trim().toUpperCase(),
      applicantName,
      loanType,
      assignedTo,
      status: 'Login',
      createdBy: req.user._id,
      timeline: [
        {
          action: 'File created',
          toStatus: 'Login',
          performedBy: req.user._id,
          note: `File created by ${req.user.name}`,
        },
      ],
    });

    await file.save();

    const populatedFile = await LoanFile.findById(file._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedFile);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'File number already exists. Please use a unique MCF ID.' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/files/:id/status - update file status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, note } = req.body;
    const file = await LoanFile.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const oldStatus = file.status;

    file.status = status;
    file.timeline.push({
      action: `Status changed from "${oldStatus}" to "${status}"`,
      fromStatus: oldStatus,
      toStatus: status,
      performedBy: req.user._id,
      note: note || `Status updated by ${req.user.name}`,
    });

    await file.save();

    const updatedFile = await LoanFile.findById(file._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('timeline.performedBy', 'name email role');

    res.json(updatedFile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/files/:id - update file details
router.put('/:id', protect, async (req, res) => {
  try {
    const { applicantName, loanType, assignedTo } = req.body;
    const file = await LoanFile.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const changes = [];
    if (applicantName && applicantName !== file.applicantName) {
      changes.push(`Name changed from "${file.applicantName}" to "${applicantName}"`);
      file.applicantName = applicantName;
    }
    if (loanType && loanType !== file.loanType) {
      changes.push(`Loan type changed from "${file.loanType}" to "${loanType}"`);
      file.loanType = loanType;
    }
    if (assignedTo && assignedTo.toString() !== file.assignedTo.toString()) {
      changes.push('File reassigned');
      file.assignedTo = assignedTo;
    }

    if (changes.length > 0) {
      file.timeline.push({
        action: 'File details updated',
        performedBy: req.user._id,
        note: changes.join('. '),
      });
    }

    await file.save();

    const updatedFile = await LoanFile.findById(file._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('timeline.performedBy', 'name email role');

    res.json(updatedFile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/files/:id - delete file (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete files' });
    }

    const file = await LoanFile.findByIdAndDelete(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

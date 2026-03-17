const express = require('express');
const LoanFile = require('../models/LoanFile');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/files - get all files with search & filter
router.get('/', protect, async (req, res) => {
  try {
    const { search, status, assignedTo } = req.query;

    let query = {};

    // Search by applicant name or file number
    if (search) {
      query.$or = [
        { applicantName: { $regex: search, $options: 'i' } },
        { fileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by assigned sub-admin
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    const files = await LoanFile.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/files/stats - get dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const total = await LoanFile.countDocuments();
    const newFiles = await LoanFile.countDocuments({ status: 'New' });
    const underProcess = await LoanFile.countDocuments({ status: { $in: ['Under Review', 'Under Process'] } });
    const approved = await LoanFile.countDocuments({ status: 'Approved' });
    const completed = await LoanFile.countDocuments({ status: 'Completed' });
    const rejected = await LoanFile.countDocuments({ status: 'Rejected' });

    res.json({ total, newFiles, underProcess, approved, completed, rejected });
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
    const { applicantName, loanType, assignedTo } = req.body;

    const file = new LoanFile({
      applicantName,
      loanType,
      assignedTo,
      status: 'New',
      createdBy: req.user._id,
      timeline: [
        {
          action: 'File created',
          toStatus: 'New',
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

const express = require('express');
const router = express.Router();
const {
  getMyApplications,
  updateApplicationStatus,
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my', protect, authorize('student'), getMyApplications);
router.patch('/:id/status', protect, authorize('organizer', 'admin'), updateApplicationStatus);

module.exports = router;


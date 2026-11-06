const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  applyOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getMyApplications,
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public search & view
router.get('/', getOpportunities);
router.get('/my/applications', protect, authorize('student'), getMyApplications);
router.get('/:id', getOpportunityById);

// Create (Organizer & Admin)
router.post('/', protect, authorize('organizer', 'admin'), createOpportunity);
router.put('/:id', protect, authorize('organizer', 'admin'), updateOpportunity);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteOpportunity);

// Student Apply
router.post('/:id/apply', protect, authorize('student'), applyOpportunity);

// Organizer review applications
router.get('/:id/applications', protect, authorize('organizer', 'admin'), getOpportunityApplications);
router.patch('/applications/:id/status', protect, authorize('organizer', 'admin'), updateApplicationStatus);

module.exports = router;

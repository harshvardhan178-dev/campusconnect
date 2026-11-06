const express = require('express');
const router = express.Router();
const {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  requestToJoin,
  getTeamRequests,
  manageRequest,
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getTeams);
router.get('/:id', getTeamById);

router.post('/', protect, authorize('student'), createTeam);
router.put('/:id', protect, authorize('student', 'admin'), updateTeam);
router.delete('/:id', protect, authorize('student', 'admin'), deleteTeam);

// Join Requests
router.post('/:id/requests', protect, authorize('student'), requestToJoin);
router.get('/:id/requests', protect, authorize('student', 'admin'), getTeamRequests);
router.patch('/requests/:id', protect, authorize('student', 'admin'), manageRequest);

module.exports = router;

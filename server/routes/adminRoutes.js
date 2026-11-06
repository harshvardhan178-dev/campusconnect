const express = require('express');
const router = express.Router();
const {
  getMetrics,
  getAllUsers,
  updateUserStatus,
  deleteFlaggedContent,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getMetrics);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/content/:type/:id', deleteFlaggedContent);

module.exports = router;

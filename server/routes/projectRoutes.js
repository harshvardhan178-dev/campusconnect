const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleLike,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:id', getProjectById);

router.post('/', protect, authorize('student'), createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/like', protect, toggleLike);

module.exports = router;

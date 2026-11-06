const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  toggleBookmarkOpportunity,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getMyProfile);
router.get('/profile/:id', getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.post('/bookmarks/opportunity/:id', protect, toggleBookmarkOpportunity);

module.exports = router;

const User = require('../models/User');
const Project = require('../models/Project');
const ApiException = require('../exceptions/ApiException');

/**
 * @desc    Get authenticated user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return next(ApiException.notFound('User profile not found'));
    }

    const projects = await Project.find({ ownerId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user public profile by ID
 * @route   GET /api/users/profile/:id
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(ApiException.notFound('User profile not found'));
    }

    const projects = await Project.find({ ownerId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update authenticated user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      college: req.body.college,
      degree: req.body.degree,
      graduationYear: req.body.graduationYear,
      bio: req.body.bio,
      githubUrl: req.body.githubUrl,
      linkedinUrl: req.body.linkedinUrl,
      skills: Array.isArray(req.body.skills) ? req.body.skills : undefined,
    };

    // Clean undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload / update user avatar
 * @route   PUT /api/users/avatar
 * @access  Private
 */
const uploadAvatar = async (req, res, next) => {
  try {
    let avatarUrl;
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.avatarUrl) {
      avatarUrl = req.body.avatarUrl;
    } else {
      return next(ApiException.badRequest('Please upload an image file or provide avatarUrl.'));
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: user.avatar,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle bookmark for an opportunity
 * @route   POST /api/users/bookmarks/opportunity/:id
 * @access  Private
 */
const toggleBookmarkOpportunity = async (req, res, next) => {
  try {
    const oppId = req.params.id;
    const user = await User.findById(req.user.id);

    const isBookmarked = user.bookmarks.opportunities.some(
      (id) => id.toString() === oppId
    );

    if (isBookmarked) {
      user.bookmarks.opportunities = user.bookmarks.opportunities.filter(
        (id) => id.toString() !== oppId
      );
    } else {
      user.bookmarks.opportunities.push(oppId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isBookmarked: !isBookmarked,
      message: !isBookmarked ? 'Opportunity bookmarked' : 'Bookmark removed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  getUserProfile,
  updateProfile,
  uploadAvatar,
  toggleBookmarkOpportunity,
};

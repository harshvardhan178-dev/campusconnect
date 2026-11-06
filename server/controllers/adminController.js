const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Team = require('../models/Team');
const Project = require('../models/Project');
const Application = require('../models/Application');
const ApiException = require('../exceptions/ApiException');

/**
 * @desc    Get system-wide metrics and stats for Admin Dashboard
 * @route   GET /api/admin/metrics
 * @access  Private (Admin)
 */
const getMetrics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalOpportunities = await Opportunity.countDocuments();
    const totalTeams = await Team.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Recent signups
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalStudents,
          totalOrganizers,
          totalOpportunities,
          totalTeams,
          totalProjects,
          totalApplications,
        },
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users with pagination & search
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user status (activate / deactivate / change role)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(ApiException.notFound('User not found'));
    }

    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }

    if (role && ['student', 'organizer', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove flagged/inappropriate content
 * @route   DELETE /api/admin/content/:type/:id
 * @access  Private (Admin)
 */
const deleteFlaggedContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;

    if (type === 'opportunity') {
      await Opportunity.findByIdAndDelete(id);
    } else if (type === 'team') {
      await Team.findByIdAndDelete(id);
    } else if (type === 'project') {
      await Project.findByIdAndDelete(id);
    } else {
      return next(ApiException.badRequest('Invalid content type. Expected opportunity, team, or project.'));
    }

    res.status(200).json({
      success: true,
      message: `Flagged ${type} removed by administrator`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetrics,
  getAllUsers,
  updateUserStatus,
  deleteFlaggedContent,
};

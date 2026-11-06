const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiException = require('../exceptions/ApiException');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, college, degree, graduationYear, skills } = req.body;

    if (!name || !email || !password) {
      return next(ApiException.badRequest('Please provide name, email, and password.'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(ApiException.conflict('An account with this email already exists.'));
    }

    // Default to student if not valid role
    const assignedRole = ['student', 'organizer'].includes(role) ? role : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      college: college || '',
      degree: degree || '',
      graduationYear: graduationYear || null,
      skills: Array.isArray(skills) ? skills : [],
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        college: user.college,
        skills: user.skills,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ApiException.badRequest('Please enter email and password.'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(ApiException.unauthorized('Invalid email or password credentials.'));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(ApiException.unauthorized('Invalid email or password credentials.'));
    }

    if (!user.isActive) {
      return next(ApiException.forbidden('This account has been suspended. Please contact support.'));
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        skills: user.skills,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Return 200 for security to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset token has been issued.',
      });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully',
      resetToken, // Returned in JSON response for test/dev convenience
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return next(ApiException.badRequest('Please provide both reset token and new password.'));
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(ApiException.badRequest('Reset token is invalid or has expired.'));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You may now log in with your new credentials.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};

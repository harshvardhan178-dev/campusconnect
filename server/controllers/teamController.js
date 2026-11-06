const Team = require('../models/Team');
const TeamRequest = require('../models/TeamRequest');
const Notification = require('../models/Notification');
const ApiException = require('../exceptions/ApiException');

/**
 * @desc    Get all teams open for recruitment
 * @route   GET /api/teams
 * @access  Public
 */
const getTeams = async (req, res, next) => {
  try {
    const { search, skill, status } = req.query;
    let query = { visibility: 'public' };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (skill && skill !== 'all') {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const teams = await Team.find(query)
      .populate('leaderId', 'name email avatar college skills')
      .populate('members', 'name email avatar skills')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single team by ID
 * @route   GET /api/teams/:id
 * @access  Public
 */
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leaderId', 'name email avatar college skills githubUrl linkedinUrl')
      .populate('members', 'name email avatar skills college githubUrl');

    if (!team) {
      return next(ApiException.notFound('Team not found'));
    }

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new project team
 * @route   POST /api/teams
 * @access  Private (Student)
 */
const createTeam = async (req, res, next) => {
  try {
    const { title, description, requiredSkills, totalPositions, visibility, contactDiscordOrSlack } =
      req.body;

    if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
      return next(ApiException.badRequest('Title, description, and required skills are mandatory.'));
    }

    const total = parseInt(totalPositions) || 4;
    // Leader counts as first member
    const open = Math.max(1, total - 1);

    const team = await Team.create({
      leaderId: req.user.id,
      title,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
      totalPositions: total,
      openPositions: open,
      members: [req.user.id],
      visibility: visibility || 'public',
      status: 'recruiting',
      contactDiscordOrSlack: contactDiscordOrSlack || '',
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully and open for recruitment!',
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update team information
 * @route   PUT /api/teams/:id
 * @access  Private (Leader)
 */
const updateTeam = async (req, res, next) => {
  try {
    let team = await Team.findById(req.params.id);

    if (!team) {
      return next(ApiException.notFound('Team not found'));
    }

    if (team.leaderId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('Only the team leader can update team settings.'));
    }

    team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete team
 * @route   DELETE /api/teams/:id
 * @access  Private (Leader / Admin)
 */
const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return next(ApiException.notFound('Team not found'));
    }

    if (team.leaderId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('You are not authorized to delete this team.'));
    }

    await team.deleteOne();
    await TeamRequest.deleteMany({ teamId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send joining request to a team
 * @route   POST /api/teams/:id/requests
 * @access  Private (Student)
 */
const requestToJoin = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return next(ApiException.notFound('Team not found'));
    }

    if (team.openPositions <= 0 || team.status === 'full') {
      return next(ApiException.badRequest('This team is already full.'));
    }

    if (team.leaderId.toString() === req.user.id) {
      return next(ApiException.badRequest('You are the leader of this team.'));
    }

    if (team.members.includes(req.user.id)) {
      return next(ApiException.badRequest('You are already a member of this team.'));
    }

    const existingRequest = await TeamRequest.findOne({
      teamId: team._id,
      studentId: req.user.id,
    });

    if (existingRequest) {
      return next(ApiException.conflict('You have already submitted a join request for this team.'));
    }

    const { message } = req.body;
    if (!message) {
      return next(ApiException.badRequest('Please add a message with your request.'));
    }

    const request = await TeamRequest.create({
      teamId: team._id,
      studentId: req.user.id,
      message,
    });

    // Notify team leader
    await Notification.create({
      recipientId: team.leaderId,
      senderId: req.user.id,
      title: 'New Team Join Request',
      message: `${req.user.name} requested to join your team "${team.title}".`,
      type: 'team_request',
      link: `/teams/${team._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Join request sent to the team leader!',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all joining requests for a team
 * @route   GET /api/teams/:id/requests
 * @access  Private (Leader)
 */
const getTeamRequests = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return next(ApiException.notFound('Team not found'));
    }

    if (team.leaderId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('Only the team leader can view membership requests.'));
    }

    const requests = await TeamRequest.find({ teamId: req.params.id })
      .populate('studentId', 'name email avatar college skills degree graduationYear githubUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept or reject a team join request
 * @route   PATCH /api/requests/:id
 * @access  Private (Leader)
 */
const manageRequest = async (req, res, next) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return next(ApiException.badRequest('Status must be either accepted or rejected.'));
    }

    const request = await TeamRequest.findById(req.params.id).populate('teamId');

    if (!request) {
      return next(ApiException.notFound('Join request not found'));
    }

    const team = await Team.findById(request.teamId._id);

    if (team.leaderId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('Only the team leader can decide on membership requests.'));
    }

    if (status === 'accepted') {
      if (team.openPositions <= 0) {
        return next(ApiException.badRequest('Cannot accept: team is already full.'));
      }

      // Add to team members
      if (!team.members.includes(request.studentId)) {
        team.members.push(request.studentId);
        team.openPositions = Math.max(0, team.openPositions - 1);
        if (team.openPositions === 0) {
          team.status = 'full';
        }
        await team.save();
      }
    }

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    // Notify student
    await Notification.create({
      recipientId: request.studentId,
      senderId: req.user.id,
      title: `Team Request ${status === 'accepted' ? 'Accepted! 🎉' : 'Declined'}`,
      message: `Your request to join "${team.title}" has been ${status}.`,
      type: 'team_response',
      link: `/teams/${team._id}`,
    });

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully`,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  requestToJoin,
  getTeamRequests,
  manageRequest,
};

const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const ApiException = require('../exceptions/ApiException');

/**
 * @desc    Get all opportunities with search and filters
 * @route   GET /api/opportunities
 * @access  Public
 */
const getOpportunities = async (req, res, next) => {
  try {
    const { category, locationType, search, status } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (locationType && locationType !== 'all') {
      query.locationType = locationType;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = 'open';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organizationName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $regex: search, $options: 'i' } },
      ];
    }

    const opportunities = await Opportunity.find(query)
      .populate('organizerId', 'name email avatar organizationName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single opportunity by ID
 * @route   GET /api/opportunities/:id
 * @access  Public
 */
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      'organizerId',
      'name email avatar college'
    );

    if (!opportunity) {
      return next(ApiException.notFound('Opportunity not found'));
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new opportunity
 * @route   POST /api/opportunities
 * @access  Private (Organizer / Admin)
 */
const createOpportunity = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      locationType,
      location,
      organizationName,
      organizationLogo,
      deadline,
      requiredSkills,
      applyLink,
      rewardOrStipend,
    } = req.body;

    if (!title || !description || !category || !organizationName || !deadline) {
      return next(ApiException.badRequest('Please fill in all mandatory opportunity details.'));
    }

    const opportunity = await Opportunity.create({
      organizerId: req.user.id,
      title,
      description,
      category,
      locationType: locationType || 'remote',
      location: location || 'Virtual',
      organizationName,
      organizationLogo: organizationLogo || undefined,
      deadline,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      applyLink: applyLink || '',
      rewardOrStipend: rewardOrStipend || 'Certificate & Perks',
    });

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully',
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update opportunity
 * @route   PUT /api/opportunities/:id
 * @access  Private (Owner / Admin)
 */
const updateOpportunity = async (req, res, next) => {
  try {
    let opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(ApiException.notFound('Opportunity not found'));
    }

    // Check ownership
    if (opportunity.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('You are not authorized to update this opportunity.'));
    }

    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully',
      data: opportunity,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete opportunity
 * @route   DELETE /api/opportunities/:id
 * @access  Private (Owner / Admin)
 */
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(ApiException.notFound('Opportunity not found'));
    }

    if (opportunity.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('You are not authorized to delete this opportunity.'));
    }

    await opportunity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Opportunity removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Apply for an opportunity
 * @route   POST /api/opportunities/:id/apply
 * @access  Private (Student)
 */
const applyOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(ApiException.notFound('Opportunity not found'));
    }

    if (opportunity.status === 'closed') {
      return next(ApiException.badRequest('Applications for this opportunity are closed.'));
    }

    const { resumeLink, statementOfPurpose, portfolioLink } = req.body;

    if (!resumeLink) {
      return next(ApiException.badRequest('Please provide a resume URL or upload link.'));
    }

    const existingApplication = await Application.findOne({
      opportunityId: opportunity._id,
      studentId: req.user.id,
    });

    if (existingApplication) {
      return next(ApiException.conflict('You have already submitted an application for this opportunity.'));
    }

    const application = await Application.create({
      opportunityId: opportunity._id,
      studentId: req.user.id,
      resumeLink,
      statementOfPurpose: statementOfPurpose || '',
      portfolioLink: portfolioLink || '',
    });

    // Create Notification for the organizer
    await Notification.create({
      recipientId: opportunity.organizerId,
      senderId: req.user.id,
      title: 'New Application Received',
      message: `${req.user.name} applied for "${opportunity.title}"`,
      type: 'team_request',
      link: `/opportunities/${opportunity._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications for a specific opportunity
 * @route   GET /api/opportunities/:id/applications
 * @access  Private (Owner / Admin)
 */
const getOpportunityApplications = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return next(ApiException.notFound('Opportunity not found'));
    }

    if (opportunity.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('You are not authorized to view applications for this opportunity.'));
    }

    const applications = await Application.find({ opportunityId: req.params.id })
      .populate('studentId', 'name email avatar college skills degree graduationYear githubUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status
 * @route   PATCH /api/applications/:id/status
 * @access  Private (Organizer / Admin)
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewerFeedback } = req.body;
    const allowedStatuses = ['applied', 'under_review', 'shortlisted', 'accepted', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return next(ApiException.badRequest('Invalid application status.'));
    }

    const application = await Application.findById(req.params.id).populate('opportunityId');

    if (!application) {
      return next(ApiException.notFound('Application not found'));
    }

    application.status = status;
    if (reviewerFeedback !== undefined) {
      application.reviewerFeedback = reviewerFeedback;
    }
    await application.save();

    // Send Notification to Student
    await Notification.create({
      recipientId: application.studentId,
      senderId: req.user.id,
      title: 'Application Status Updated',
      message: `Your application status for "${application.opportunityId.title}" is now "${status.toUpperCase()}".`,
      type: 'application_update',
      link: `/opportunities/${application.opportunityId._id}`,
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student's own submitted applications
 * @route   GET /api/applications/my
 * @access  Private (Student)
 */
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('opportunityId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  applyOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getMyApplications,
};

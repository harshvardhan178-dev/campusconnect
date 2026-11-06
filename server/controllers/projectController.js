const Project = require('../models/Project');
const ApiException = require('../exceptions/ApiException');

/**
 * @desc    Get all showcase projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    const { search, tech } = req.query;
    let query = {};

    if (tech && tech !== 'all') {
      query.technologies = { $in: [new RegExp(tech, 'i')] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query)
      .populate('ownerId', 'name email avatar college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'name email avatar college skills githubUrl linkedinUrl')
      .populate('likes', 'name avatar');

    if (!project) {
      return next(ApiException.notFound('Project not found'));
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Publish a new project
 * @route   POST /api/projects
 * @access  Private (Student)
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubRepo, liveDemo, screenshotUrl } = req.body;

    if (!title || !description || !technologies) {
      return next(ApiException.badRequest('Title, description, and technologies are required.'));
    }

    const project = await Project.create({
      ownerId: req.user.id,
      title,
      description,
      technologies: Array.isArray(technologies) ? technologies : [technologies],
      githubRepo: githubRepo || '',
      liveDemo: liveDemo || '',
      screenshotUrl: screenshotUrl || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Project published to showcase!',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Owner / Admin)
 */
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiException.notFound('Project not found'));
    }

    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('You are not authorized to update this project.'));
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Owner / Admin)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiException.notFound('Project not found'));
    }

    if (project.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(ApiException.forbidden('You are not authorized to delete this project.'));
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project removed from showcase',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle like for a project
 * @route   POST /api/projects/:id/like
 * @access  Private
 */
const toggleLike = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(ApiException.notFound('Project not found'));
    }

    const hasLiked = project.likes.some((id) => id.toString() === req.user.id);

    if (hasLiked) {
      project.likes = project.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      project.likes.push(req.user.id);
    }

    await project.save();

    res.status(200).json({
      success: true,
      liked: !hasLiked,
      likesCount: project.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleLike,
};

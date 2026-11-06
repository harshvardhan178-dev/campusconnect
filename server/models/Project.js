const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
    },
    technologies: {
      type: [String],
      required: [true, 'Please specify at least one technology used'],
    },
    githubRepo: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemo: {
      type: String,
      trim: true,
      default: '',
    },
    screenshotUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ title: 'text', technologies: 'text' });

module.exports = mongoose.model('Project', projectSchema);

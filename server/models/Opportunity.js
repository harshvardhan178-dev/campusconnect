const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an opportunity title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['internship', 'hackathon', 'workshop', 'competition'],
    },
    locationType: {
      type: String,
      enum: ['remote', 'on-site', 'hybrid'],
      default: 'remote',
    },
    location: {
      type: String,
      default: 'Virtual / Online',
    },
    organizationName: {
      type: String,
      required: [true, 'Please provide the organizer/company name'],
      trim: true,
    },
    organizationLogo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200',
    },
    deadline: {
      type: Date,
      required: [true, 'Please specify an application deadline'],
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    applyLink: {
      type: String,
      trim: true,
      default: '',
    },
    rewardOrStipend: {
      type: String,
      default: 'Certificate & Mentorship',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for filtering
opportunitySchema.index({ category: 1, deadline: 1, status: 1 });
opportunitySchema.index({ title: 'text', organizationName: 'text', requiredSkills: 'text' });

module.exports = mongoose.model('Opportunity', opportunitySchema);

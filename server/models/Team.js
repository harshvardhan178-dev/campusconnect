const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    leaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a team or project title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please describe your project team and objectives'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please specify at least one required technical skill'],
    },
    totalPositions: {
      type: Number,
      required: [true, 'Specify total team size'],
      min: [2, 'A team must have at least 2 members'],
      max: [10, 'Team size cannot exceed 10 members'],
      default: 4,
    },
    openPositions: {
      type: Number,
      required: true,
      default: 3,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    status: {
      type: String,
      enum: ['recruiting', 'full', 'completed'],
      default: 'recruiting',
    },
    contactDiscordOrSlack: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ title: 'text', requiredSkills: 'text' });
teamSchema.index({ status: 1, openPositions: 1 });

module.exports = mongoose.model('Team', teamSchema);

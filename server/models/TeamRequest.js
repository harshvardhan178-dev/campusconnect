const mongoose = require('mongoose');

const teamRequestSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Please include a brief message explaining your background & interest'],
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

teamRequestSchema.index({ teamId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('TeamRequest', teamRequestSchema);

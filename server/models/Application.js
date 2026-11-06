const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeLink: {
      type: String,
      required: [true, 'Please provide a resume URL or upload link'],
      trim: true,
    },
    statementOfPurpose: {
      type: String,
      maxlength: [1000, 'Statement of purpose cannot exceed 1000 characters'],
      default: '',
    },
    portfolioLink: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['applied', 'under_review', 'shortlisted', 'accepted', 'rejected'],
      default: 'applied',
    },
    reviewerFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by the same student for the same opportunity
applicationSchema.index({ opportunityId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

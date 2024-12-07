const mongoose = require('mongoose');

const equbGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    contributionPerUser: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    rounds: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'], 
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'canceled'], 
      default: 'active', 
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', 
          required: true,
        },
        hasReceivedPayout: {
          type: Boolean,
          default: false,
        },
        contributedAmount: {
          type: Number,
          default: 0, 
        },
        joinDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const EqubGroup = mongoose.model('EqubGroup', equbGroupSchema);

module.exports = EqubGroup;

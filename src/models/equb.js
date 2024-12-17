const mongoose = require('mongoose');

const equbGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      enum: ['active', 'completed', 'pending'],
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
    nextPayoutDate: {
      type: Date,
    },
    currentRound: {
      type: Number,
      default: 0,  
    },
  },
  {
    timestamps: true,
  }
);

equbGroupSchema.pre('save', function (next) {
  if (this.status === 'completed') {
    this.nextPayoutDate = null;
  } else if (!this.nextPayoutDate || this.isModified('currentRound')) {
    this.nextPayoutDate = calculateNextPayoutDate(this.startDate, this.frequency, this.currentRound, this.rounds);
  }
  next();
});


function calculateNextPayoutDate(startDate, frequency, currentRound, totalRounds) {
  if (currentRound >= totalRounds) return null; 

  const date = new Date(startDate);

  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + currentRound + 1);  
      break;
    case 'weekly':
      date.setDate(date.getDate() + (currentRound + 1) * 7);  
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + currentRound + 1);  
    default:
      throw new Error('Invalid frequency value');
  }

  return date;
}



const EqubGroup = mongoose.model('EqubGroup', equbGroupSchema);

module.exports = EqubGroup;

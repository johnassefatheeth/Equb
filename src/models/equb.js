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
        // required: true,
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


equbGroupSchema.pre('save', function (next) {
  if (!this.nextPayoutDate) {
    this.nextPayoutDate = calculateNextPayoutDate(this.startDate, this.frequency);
  }
  next();
});

 function calculateNextPayoutDate(startDate, frequency) {
  const date = new Date(startDate);
  if (frequency === 'daily') date.setDate(date.getDate() + 1);
  else if (frequency === 'weekly') date.setDate(date.getDate() + 7);
  else if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
  return date;
}


const EqubGroup = mongoose.model('EqubGroup', equbGroupSchema);

module.exports = EqubGroup;

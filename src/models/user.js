const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subCity: {
      type: String,
      required: true,
    },
    woreda: {
      type: Number,
      required: true,
    },
    houseNo: {
      type: String,
      required: true,
    },
    specificLocation: {
      type: String,
      required: false,
      trim: true,
    },
    completedEqubs: [
      {
        equbId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'EqubGroup',
        },
        totalContribution: {
          type: Number,
        },
        receivedAmount: {
          type: Number,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [ 'admin', 'regular'],
      default: 'regular'
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;

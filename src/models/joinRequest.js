const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    equbId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EqubGroup',
      required: true,
    },
    receiptImage: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userAccNumber: {
     type: String,
     required: true,
    }
     },
  { timestamps: true }
);

const JoinRequest = mongoose.model('JoinRequest', joinRequestSchema);

module.exports = JoinRequest;

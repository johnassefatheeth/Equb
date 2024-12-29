const User = require('../models/user');
const EqubGroup = require('../models/equb');
const JoinRequest = require('../models/joinRequest');
const bcrypt=require('bcrypt')
const { isPassMatched, hashPassword } = require('../utils/passwordHelper');
const { sendmail } = require('../services/emailService');



exports.getUserEqubGroups = async (req, res) => {
  try {
    const userId = req.user._id;  

     const userGroups = await EqubGroup.find({ 
      'participants.userId': userId 
    }).select('-participants'); 

    if (!userGroups || userGroups.length === 0) {
      return res.status(404).json({ message: 'No Equb groups found for this user' });
    }

    res.status(200).json({ message: 'Fetched user Equb groups successfully', userGroups });
  } catch (error) {
    console.error('Error fetching user Equb groups:', error);
    res.status(500).json({ message: 'Error fetching user Equb groups', error });
  }
};

exports.submitJoinRequest = async (req, res) => {
  const { equbId, userAccNumber } = req.body; 
  const userId = req.user._id; 
  const receiptImage = req.file ? req.file.path : null;

  if (!receiptImage) {
    return res.status(400).json({ message: 'Receipt image is required.' });
  }

  try {
    const newRequest = new JoinRequest({
      userId,
      equbId,
      receiptImage,
      userAccNumber
    });

    await newRequest.save();
    res.status(201).json({ message: 'Join request submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.user._id; 
    
    const user = await User.findById(userId).select('-password -otp -otpExpiresAt -isVerified -createdAt -updatedAt -specificLocation -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data as JSON
    res.status(200).json({ message: 'User data fetched successfully', user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};
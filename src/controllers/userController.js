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

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const updates = req.body; 

    const allowedFields = [
      'name',
      'phone',
      'gender',
      'city',
      'subCity',
      'woreda',
      'houseNo',
      'specificLocation',
    ];

    const invalidFields = Object.keys(updates).filter(
      (key) => !allowedFields.includes(key)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields in request: ${invalidFields.join(', ')}`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    for (const key in updates) {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both old and new passwords are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'The new password must be at least 8 characters long.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await isPassMatched(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'The old password is incorrect.' });
    }

    const hashedPassword = await hashPassword(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message,
    });
  }
};


// Controller to handle forgot password request

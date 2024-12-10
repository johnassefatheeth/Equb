const User = require('../models/user');
const EqubGroup = require('../models/equb');
const { generateOtp, sendOtpEmail } = require('../services/emailService');



exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    const otp = generateOtp();
    
    // const otpExpiry = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Save OTP and expiry to the user's record
    // user.otp = otp;
    // user.otpExpiry = otpExpiry;
    // await user.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP is invalid or has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified successfully, clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.collectPersonalInfo = async (req, res) => {
    try {
      const { phone, name, gender, password, confirmPassword } = req.body;
  
      if (!phone || !name || !gender || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }
  
      const user = new User({
        phone,
        name,
        gender,
        password, 
      });
  
      await user.save();
  
      res.status(201).json({ message: 'Personal information saved', userId: user._id });
    } catch (error) {
      res.status(500).json({ message: 'Error saving personal information', error });
    }
};

exports.collectAddressInfo = async (req, res) => {
    try {
      const { userId, city, subCity, woreda, houseNo, specificLocation } = req.body;
  
      if (!userId || !city || !subCity || !woreda || !houseNo || !specificLocation) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.city = city;
      user.subCity = subCity;
      user.woreda = woreda;
      user.houseNo = houseNo;
      user.specificLocation = specificLocation;
      await user.save();
  
      res.status(200).json({ message: 'Address information saved', user });
    } catch (error) {
      res.status(500).json({ message: 'Error saving address information', error });
    }
};

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

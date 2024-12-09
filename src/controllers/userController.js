const User = require('../models/user');
const OTPService = require('../services/otpService'); 
const EqubGroup = require('../models/equb');

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered with this phone number' });
    }

    const otp = OTPService.generateOtp(); 
    await OTPService.sendOtp(phone, otp); 

    req.session.otp = otp;
    req.session.phone = phone;

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
};

exports.verifyOtp = async (req, res) => {
    try {
      const { phone, otp } = req.body;
  
      if (!phone || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
      }
  
      if (req.session.phone !== phone) {
        return res.status(400).json({ message: 'Phone number does not match' });
      }
  
      if (req.session.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      delete req.session.otp;
  
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying OTP', error });
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


  
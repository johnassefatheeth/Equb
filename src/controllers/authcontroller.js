const User=require('../models/user')
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const { sendOtpEmail } = require('../services/emailService')
const { createToken } = require('../utils/createToken')


  exports.SignUp_Post = async (req, res) => {
    const { name, email, password ,
            phone,gender,confirmpassword,
            city, subCity, woreda, houseNo
    } = req.body;

    const user=await User.findOne({email})

    if(user){
       return res.json('email already exists')
    }

    if (password !== confirmpassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
  
    try {
      const otp = crypto.randomInt(100000, 999999).toString(); 
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); 
  
      const user = new User({ name, email, password , otp, otpExpiresAt,
                              phone,gender,confirmpassword,
                              city, subCity, woreda, houseNo
       });
      await user.save();
      
      await sendOtpEmail(email, otp);
  
      res.status(200).json({ message: 'Signup successful. OTP sent to your email.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.VerifyOtp_Post = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }
      
      if (user.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP.' });
      }
  
      if (user.otpExpiresAt < new Date()) {
        return res.status(400).json({ error: 'OTP has expired.' });
      }
  
      user.isVerified = true;
      user.otp = null;
      user.otpExpiresAt = null; 
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
exports.LogIn_Post=async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
       return res.json('user does not exist')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
       return res.json('incorrect password')
    }
    const token=createToken(user._id)
    res.cookie('jwt',token,{httpOnly:true,maxAge: 3600000})
        res.json(user)
}

exports.LogOut_Post=async(req,res)=>{
    res.cookie('jwt','',{maxAge:0,httpOnly:true})
    res.json('logout success')
}
const User=require('../models/user')
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const { sendOtpEmail } = require('../services/emailService')
const { createToken } = require('../utils/createToken')
const { isPassMatched, hashPassword } = require('../utils/passwordHelper')

  exports.SignUp_Post = async (req, res) => {
    console.log('signup requested')
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
  
      const user = new User({ name, email, password : await hashPassword(password) , otp, otpExpiresAt,
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
  
  
exports.LogIn_Post=async (req, res) => {

  const { phone, password } = req.body;

  const newUser = await User.findOne({ phone });

  if (!newUser) {
      return res.status(404).json({ message: "Account not found" });
  }

  const isMatched = await isPassMatched(password, newUser.password);

  if (!isMatched) {
      console.error(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: "Invalid login credentials" });
  } else {
      const token=createToken(newUser._id)
      return res.json({
        message: "Login successful",
        token: token,  
        user: {
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
        }
      });
  }
};


exports.LogOut_Post=async(req,res)=>{
    res.cookie('jwt','',{maxAge:0,httpOnly:true})
    res.json('logout success')
}


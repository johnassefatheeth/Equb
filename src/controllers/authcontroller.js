const User=require('../models/user')
const bcrypt=require('bcrypt')
const crypto=require('crypto')
const nodemailer=require('nodemailer')

function createToken(id){
    const secret='shalom secret'
    const options={expiresIn:'1h'}
    return jwt.sign({id},secret,options)

}


const sendOtpEmail = async (email, otp) => {
    try{
            // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth: {
          user: 'shalomwubu024@gmail.com', // Your email
          pass: 'edpe yfyc pjgs xlll', // Your email password or app password (for Gmail)
        },
        tls: {
            rejectUnauthorized: false, // Accept self-signed certificates
          },
      });
    
      // Email options
      const mailOptions = {
        from: 'shalomwubu024@gmail.com',
        to: email,
        subject: 'your otp code',
        text: `Your OTP is ${otp}. It is valid for 10 minutes`,
      };
      const sendmail=async(transporter,mailOptions)=>{
        try{
            await transporter.sendMail(mailOptions);
            console.log('otp sent successfully')

        }
        catch(err){
            console.error(err)

        }
      }
      sendmail(transporter,mailOptions)

    }
    catch(err){
        console.error(err)

    }

}



  module.exports.SignUp_Post = async (req, res) => {
    const { name, email, password ,
            phone,gender,confirmpassword,
            city,subcity,woreda,housenumber


    } = req.body;
    if (password !== confirmpassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
  
    try {
      const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
  
      const user = new User({ name, email, password, otp, otpExpiresAt,
                              phone,gender,confirmpassword,
                              city,subcity,woreda,housenumber
       });
      await user.save();
  
      // Send OTP to the user's email
      await sendOtpEmail(email, otp);
  
      res.status(200).json({ message: 'Signup successful. OTP sent to your email.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  module.exports.VerifyOtp_Post = async (req, res) => {
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
      user.otpExpiresAt = null; // Clear OTP and expiration time
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
module.exports.LogIn_Post=async(req,res)=>{
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
module.exports.LogOut_Post=async(req,res)=>{
    res.cookie('jwt','',{maxAge:0,httpOnly:true})
    res.json('logout success')
}
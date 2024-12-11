const crypto = require('crypto');
const nodemailer = require('nodemailer');
 


const sendOtpEmail = async (email, otp) => {
  try{

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      auth: {
        user: 'shalomwubu024@gmail.com', 
        pass: 'edpe yfyc pjgs xlll', 
      },
      tls: {
          rejectUnauthorized: false, 
        },
    });
  
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

module.exports = {
  sendOtpEmail,
};

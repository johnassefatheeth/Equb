exports.generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); 
  };
  
  exports.sendOtp = async (phone, otp) => {
    // Use any SMS gateway service here (e.g., Twilio, Vonage)
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
    // Example: await smsGateway.send(phone, `Your OTP is: ${otp}`);
  };
  
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * Generates a 6-digit OTP.
 * @returns {string} A randomly generated OTP.
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Sends an OTP email.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to be sent.
 */
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    html: `
      <h2>One-Time Password</h2>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code is valid for 5 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOtp,
  sendOtpEmail,
};

const express = require('express');
const { sendOtp, verifyOtp, collectPersonalInfo, collectAddressInfo } = require('../controllers/userController');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register/personal-info', collectPersonalInfo);
router.post('/register/address-info', collectAddressInfo);

module.exports = router;

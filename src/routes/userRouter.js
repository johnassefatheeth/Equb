const express = require('express');
const { sendOtp, verifyOtp, collectPersonalInfo, collectAddressInfo, getUserEqubGroups } = require('../controllers/userController');
const { isLogin } = require('../routes/equbRouter')

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register/personal-info', collectPersonalInfo);
router.post('/register/address-info', collectAddressInfo);
router.get('/user/equb-groups',/* isLogin,*/ getUserEqubGroups);


module.exports = router;

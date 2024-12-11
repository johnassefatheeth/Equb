const express = require('express');
const router = express.Router();

const {SignUp_Post, VerifyOtp_Post, LogIn_Post, LogOut_Post}=require('../controllers/authcontroller')

router.post('/signup', SignUp_Post)
router.post('/verify-email',VerifyOtp_Post)

router.post('/login',LogIn_Post)
router.post('/logout',LogOut_Post)

module.exports=router
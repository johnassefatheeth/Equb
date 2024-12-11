const express = require('express');
const router = express.Router();

const authcontroller=require('../controllers/authcontroller')

router.post('/signup',authcontroller.SignUp_Post)
router.post('/verify-email',authcontroller.VerifyOtp_Post)

router.post('/login',authcontroller.LogIn_Post)
router.post('/logout',authcontroller.LogOut_Post)

module.exports=router
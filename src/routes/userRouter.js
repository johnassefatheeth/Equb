const express = require('express');
const {  getUserEqubGroups } = require('../controllers/userController');
const { isLogin } = require('../middlewares/authMiddleware')

const router = express.Router();


router.get('/user/equb-groups',/* isLogin,*/ getUserEqubGroups);


module.exports = router;

const express = require('express');
const {  getUserEqubGroups, submitJoinRequest, updateUserProfile, changePassword } = require('../controllers/userController');
const { isLogin } = require('../middlewares/authMiddleware')
const { upload } = require('../middlewares/upload');

const router = express.Router();

router.get('/equb-groups', isLogin, getUserEqubGroups);
router.get('/user-data', isLogin, getUserData);
router.post('/join-request', isLogin, upload.single('receiptImage'), submitJoinRequest);
router.put('/profile', isLogin, updateUserProfile);
router.put('/change-password', isLogin, changePassword);



module.exports = router;


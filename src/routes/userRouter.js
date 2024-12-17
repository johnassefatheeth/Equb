const express = require('express');
const {  getUserEqubGroups, submitJoinRequest } = require('../controllers/userController');
const { isLogin } = require('../middlewares/authMiddleware')
const { upload } = require('../middlewares/upload');

const router = express.Router();


router.get('/equb-groups', isLogin, getUserEqubGroups);
router.post('/join-request', isLogin, upload.single('receiptImage'), submitJoinRequest);


module.exports = router;

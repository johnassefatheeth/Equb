const express = require('express');

const { createEqubGroupByAdmin, fetchJoinRequests, registerAdminCtrl, adminLoginCtrl, approveJoinRequest } = require('../controllers/adminController');
const { isLogin, isAdmin } = require('../middlewares/authMiddleware') 

const router = express.Router();

router.post('/approve-request/:requestId', isLogin, /*isAdmin,*/ approveJoinRequest);
router.post('/create', /*isAdmin ,*/ createEqubGroupByAdmin);
router.get('/join-requests', isLogin, /*isAdmin,*/ fetchJoinRequests);
router.post('/register', /*isAdmin,*/ registerAdminCtrl )
router.post('/admin-login', /*isAdmin,*/ adminLoginCtrl)


module.exports = router;
//draw equb

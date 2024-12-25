const express = require('express');
const router = express.Router();
const { createEqubGroupByAdmin, fetchJoinRequests } = require('../controllers/adminController');



router.post('/approve-request/:requestId', isLogin, /*isAdmin,*/ approveJoinRequest);
router.post('/create', /*isAdmin ,*/ createEqubGroupByAdmin);
router.get('/join-requests', isLogin, /*isAdmin,*/ fetchJoinRequests);


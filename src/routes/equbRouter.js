const express = require('express');
const { createEqubGroupByAdmin, joinEqubGroup, getAllEqubGroups, getEqubGroupById, processEqubPaymentsHandler } = require('../controllers/equbController');
const { isAdmin, isLogin } = require('../middlewares/authMiddleware'); 

const router = express.Router();

 router.post('/create', /*isAdmin ,*/ createEqubGroupByAdmin);

 router.post('/join',/* isLogin ,*/ joinEqubGroup);

 router.get('/equb/:id', /* isLogin ,*/ getEqubGroupById);

 router.get('/equbs', /* isLogin ,*/ getAllEqubGroups);

 router.post('/process-payments', processEqubPaymentsHandler);


module.exports = router;

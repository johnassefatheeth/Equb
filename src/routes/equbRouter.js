const express = require('express');
const { joinEqubGroup, getAllEqubGroups, getEqubGroupById, processEqubPayments, getCompletedEqubs } = require('../controllers/equbController');
const { isAdmin, isLogin } = require('../middlewares/authMiddleware'); 
const { checkAndCompleteEqubs } = require('../services/scheduler')

const router = express.Router();


 router.post('/join/:equbId', isLogin , joinEqubGroup);

 router.get('/equb/:id',  isLogin , getEqubGroupById);

 router.get('/equbs',  isLogin , getAllEqubGroups);

//  router.post('/process-payments', processEqubPayments);

 router.get('/get-complete-equbs', getCompletedEqubs);

 router.post('/test-complete-equbs', async (req, res) => {
    try {
        await checkAndCompleteEqubs();
        res.status(200).json({ message: 'Equb completion process triggered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error running the equb completion process', error });
    }
});


module.exports = router;

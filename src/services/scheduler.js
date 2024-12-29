const cron = require('node-cron');
const EqubGroup = require('../models/equb');
const { processEqubPayments } = require('../controllers/equbController');

const checkAndCompleteEqubs = async () => {
  try {
    const today = new Date();

     const equbGroups = await EqubGroup.find({
      status: 'completed',
      endDate: { $lte: today },
    });

    let completedCount = 0;

    for (const equbGroup of equbGroups) {
       const allPaid = equbGroup.participants.every(
        (participant) => participant.hasReceivedPayout
      );

      if (allPaid) {
        equbGroup.status = 'completed';
        await equbGroup.save();
        completedCount++;
        console.log(`Equb group "${equbGroup.name}" marked as completed.`);
      }
    }

    console.log(
      `Processed ${equbGroups.length} Equb groups. Marked ${completedCount} as completed.`
    );
  } catch (error) {
    console.error('Error completing Equb groups:', error);
  }
};

cron.schedule('0 0 * * *', () => {
  console.log('Running all scheduled Equb tasks...');
  checkAndCompleteEqubs();
  processEqubPayments();
});



module.exports = {
  checkAndCompleteEqubs,
};

const EqubGroup = require('../models/equb');
const User = require('../models/user');
 


//tested

//tested
exports.joinEqubGroup = async (req, res) => {
  try {
    const { equbId } = req.params;  
    const userId = req.user._id;  
    if (!equbId) {
      return res.status(400).json({ message: 'Group ID is required' });
    }

     const equbGroup = await EqubGroup.findById(equbId);

    if (!equbGroup) {
      return res.status(404).json({ message: 'Equb group not found' });
    }

    if (equbGroup.status !== 'active') {
      return res.status(400).json({ message: 'This Equb group is no longer active' });
    }

     const isAlreadyParticipant = equbGroup.participants.some(
      (participant) => participant.userId.toString() === userId.toString()
    );

    if (isAlreadyParticipant) {
      return res.status(400).json({ message: 'You are already a participant in this group' });
    }

     equbGroup.participants.push({
      userId,
      hasReceivedPayout: false,
      contributedAmount: 0,
      joinDate: new Date(),
    });

     await equbGroup.save();

    res.status(200).json({ message: 'Successfully joined the Equb group', equbGroup });
  } catch (error) {
    console.error('Error joining Equb group:', error);
    res.status(500).json({ message: 'Error joining Equb group', error });
  }
};

//tested
exports.getEqubGroupById = async (req, res) => {
    try {
      const { id } = req.params;
  
       const equbGroup = await EqubGroup.findById(id);
  
      if (!equbGroup) {
        return res.status(404).json({ message: 'Equb group not found' });
      }
  
      res.status(200).json({
        success: true,
        data: equbGroup,
      });
    } catch (error) {
      console.error('Error fetching Equb group:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};


//tested
exports.getAllEqubGroups = async (req, res) => {
  try {
     const equbGroups = await EqubGroup.find();

    res.status(200).json({
      success: true,
      count: equbGroups.length,
      data: equbGroups,
    });
  } catch (error) {
    console.error('Error fetching Equb groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getCompletedEqubs = async (req, res) => {
  try {
    const completedEqubs = await EqubGroup.find({ status: 'completed' });

    if (completedEqubs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No completed Equbs found',
      });
    }

    res.status(200).json({
      success: true,
      count: completedEqubs.length,
      data: completedEqubs,
    });
  } catch (error) {
    console.error('Error fetching completed Equbs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};



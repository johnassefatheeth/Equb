const EqubGroup = require('../models/EqubGroup');

exports.approveJoinRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const joinRequest = await JoinRequest.findById(requestId);
    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found.' });
    }

    // Update join request status to 'Approved'
    joinRequest.status = 'Approved';
    await joinRequest.save();

    // Add the user to the Equb group
    await EqubGroup.findByIdAndUpdate(joinRequest.equbId, {
      $addToSet: { members: joinRequest.userId }, // Ensure no duplicates
    });

    res.status(200).json({ message: 'User has been added to the Equb group.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.createEqubGroupByAdmin = async (req, res) => {
    try {
      const { name, totalAmount, contributionPerUser, startDate, rounds, frequency } = req.body;
      // const adminId = req.user._id;
  
      // if (!req.user.isAdmin) {
      //   return res.status(403).json({ message: 'Only admins can create Equb groups' });
      // }
  
      if (!name || !totalAmount || !contributionPerUser || !startDate || !rounds || !frequency) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Calculate end date based on frequency and rounds
      const frequencyMapping = {
        daily: 1,
        weekly: 7,
        monthly: 30,
      };
  
      const intervalDays = frequencyMapping[frequency];
      if (!intervalDays) {
        return res.status(400).json({ message: 'Invalid frequency provided' });
      }
  
      const calculatedEndDate = new Date(startDate);
      calculatedEndDate.setDate(calculatedEndDate.getDate() + rounds * intervalDays);
  
      const equbGroup = new EqubGroup({
        name,
        // createdBy: adminId,
        totalAmount,
        contributionPerUser,
        startDate,
        rounds,
        frequency,
        endDate: calculatedEndDate,
        status: 'active',
        participants: [],
      });
  
      await equbGroup.save();
  
      res.status(201).json({ message: 'Equb group created successfully', equbGroup });
    } catch (error) {
      res.status(500).json({ message: 'Error creating Equb group', error });
    }
  };
  
  exports.fetchJoinRequests = async (req, res) => {
    try {
      const joinRequests = await JoinRequest.find()
        .populate('userId', 'name email') 
        .populate('equbId', 'name'); 
  
      res.status(200).json(joinRequests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isLogin = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const secret = 'shalom secret';
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Error in isLogin middleware:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};


module.exports = {isLogin};

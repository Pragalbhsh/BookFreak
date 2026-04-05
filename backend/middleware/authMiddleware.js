const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async(req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        // Verify token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Find user from decoded id → attach to request
        req.user = await User.findById(decoded.id).select('-password');
        // The minus sign means "give me everything EXCEPT password"
        // So password never leaks into req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;
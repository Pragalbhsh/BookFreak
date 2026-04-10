// this middleware checks if user is admin
// always runs AFTER authMiddleware
const adminMiddleware = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access only!' });
    }
    next();
};

module.exports = adminMiddleware;
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID from the token and attach to the request object
        // We exclude the password from being attached to the request object
        const [users] = await db.query('SELECT id, name, email, role, address FROM Users WHERE id = ?', [decoded.id]);

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        req.user = users[0];
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
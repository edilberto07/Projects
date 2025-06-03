const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

module.exports = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Auth middleware token:', token);

        if (!token) {
            return res.status(401).json({ 
                error: true, 
                message: 'Please authenticate.' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Auth middleware decoded:', decoded);

        // Set both user and userId for compatibility
        req.user = decoded;
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(401).json({ 
            error: true, 
            message: 'Please authenticate.' 
        });
    }
}; 
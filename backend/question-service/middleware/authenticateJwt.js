const jwt = require('jsonwebtoken');

const authenticateJwt = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ msg: 'Authentication failed: missing token' });
    }

    const token = header.substring(7);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ msg: 'Authentication failed: invalid token' });
        }

        req.username = user.username;
        req.isManager = user.isManager;

        next();
    })
};

const authenticateManager = (req, res, next) => {
    if (!req.isManager) {
        return res.status(401).json({ msg: 'Authentication failed: not a manager' });
    }

    next();
};

module.exports = {authenticateJwt, authenticateManager};
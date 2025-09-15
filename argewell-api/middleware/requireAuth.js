const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'Authentication required.' });
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'Invalid token.' });
        }
        req.user = await User.findById(payload.userId).select('-password');
        next();
    });
};

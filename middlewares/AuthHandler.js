const jwt = require('jsonwebtoken');
const APIError = require('../error/APIError');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") next();
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next(APIError.unauthorized())
        }
        const decodedToken = jwt.decode(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return next(APIError.unauthorized())
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        next(APIError.unauthorized())
    }
};
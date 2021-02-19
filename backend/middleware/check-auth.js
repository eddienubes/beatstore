const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer Token
        if (!token) {
            return next(new HttpError('Authentication has failed', 401));
        }

        const decodedToken = jwt.verify(token, 'supersecret_do_not_share');
        req.userData = {userId: decodedToken.userId}
        next();
    }
    catch (e) {
        return next(new HttpError('Authentication has failed', 401));
    }


};
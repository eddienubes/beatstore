const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer Token
        if (!token) {
            return next(new HttpError('Authentication has failed', 401));
        }

        const decodedToken = jwt.verify(token, config.secret);
        req.userData = {userId: decodedToken.userId}
        return next();
    }
    catch (e) {
        console.log(e.message);
        return next(new HttpError('Authentication has failed', 401));
    }
};
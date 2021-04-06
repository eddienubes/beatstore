const HttpError = require('../models/http-error');
const {OAuth2Client} = require('google-auth-library');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const tokenId = req.body.tokenId;

        if (!tokenId) {
            return next(new HttpError('Unauthorized! Token id has not been attached', 401));
        }
        const client = new OAuth2Client('718477232651-i09ba8bjtbaqlt7h1i2fq3j4klklth2h.apps.googleusercontent.com');
        // await client.getAccessToken()

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: '718477232651-i09ba8bjtbaqlt7h1i2fq3j4klklth2h.apps.googleusercontent.com'
        });
        req.userData = ticket.getPayload();
        return next();
    }
    catch (e) {
        console.log(e.message);
        return next(new HttpError('Authorization has failed due to unknown error..', 500));
    }
}
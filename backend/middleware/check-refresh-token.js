const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const RefreshToken = require('../models/refresh-token');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(new HttpError('Refresh token was not specified!', 403));
    }

    const decodedTokenData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const existingToken = await RefreshToken.findOne({ email: decodedTokenData.email });

    if (!existingToken) {
      return next(new HttpError('Token refresh has failed..'));
    }
    req.userData = decodedTokenData;
    return next();
  } catch (e) {
    console.log(e.message);
    return next(new HttpError('Token refresh has failed..'));
  }
};

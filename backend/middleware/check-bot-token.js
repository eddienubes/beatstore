const bcrypt = require('bcryptjs');
const HttpError = require('../models/http-error');
const Bot = require('../models/bot');

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.headers.authorization) {
    return next(new HttpError('Token or ID were not specified!', 403));
  }

  const token = req.headers?.authorization.split(' ')[1];
  const id = req.headers?.authorization.split(' ')[3];

  if (!token || !id) {
    return next(new HttpError('Token or ID were not specified!', 403));
  }

  let existingBot;
  try {
    existingBot = await Bot.findOne({ botId: id });
  } catch (e) {
    return next(new HttpError('An error occurred while trying to find a bot..', 500));
  }

  if (!existingBot) {
    return next(new HttpError('Bot with such ID does not exist..', 403));
  }

  let isValidToken;
  try {
    isValidToken = await bcrypt.compare(token, existingBot.token);
  } catch (e) {
    return next(new HttpError('An error occurred while trying to compare tokens..', 500));
  }

  if (!isValidToken) {
    return next(new HttpError('Wrong token was specified..', 403));
  }

  if (!existingBot.isVerified) {
    return next(new HttpError('Bot is not verified! You are forbidden to access these routes', 403));
  }

  return next();
};

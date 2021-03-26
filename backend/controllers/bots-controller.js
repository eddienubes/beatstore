const Bot = require('../models/bot');
const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');

const register = async (req, res, next) => {
    const {botId, token} = req.body;

    if (!botId || !token) {
        return next(new HttpError('Bot id or token was not specified!', 403));
    }

    let bot;
    try {
        bot = await Bot.findOne({botId});
    }
    catch (e) {
        return next(new HttpError('An error occurred while trying to find a bot..', 500));
    }

    if (bot) {
        return next(new HttpError('Bot with such ID already exists..', 403));
    }

    let hashedToken;
    try {
        hashedToken = await bcrypt.hash(token, 12);
    }
    catch (e) {
        return next(new HttpError('An error occurred while trying to hash bot token..', 500));
    }

    const newBot = new Bot({
        botId,
        token: hashedToken,
        date: new Date(),
        isVerified: false
    });

    try {
        await newBot.save();
    }
    catch (e) {
        console.log(e.message);
        return next(new HttpError('An error occurred while trying to save a bot to db..', 500));
    }

    res.status(200);
    res.json({message: 'Bot has been successfully registered!'});
}

const updateBot = async (req, res, next) => {
    const {botId, newToken, token} = req.body;

    if (!botId || !token || !newToken) {
        return next(new HttpError('Bot id or token was not specified!', 403));
    }

    let existingBot;
    try {
        existingBot = await Bot.findOne({botId});
    }
    catch (e) {
        return next(new HttpError('An error occurred while trying to find a bot..', 500));
    }

    if (!existingBot) {
        return next(new HttpError('Bot with such ID does not exist..', 403));
    }

    let isValidToken;
    try {
        isValidToken = await bcrypt.compare(token, existingBot.token);
    }
    catch (e) {
        return next(new HttpError('An error occurred while trying to compare tokens..', 500));
    }

    if (!isValidToken) {
        console.log('hey');
        return next(new HttpError('Invalid token specified..', 403));
    }

    let newHashedToken;
    try {
        newHashedToken = await bcrypt.hash(newToken, 12);
    }
    catch (e) {
        return next(new HttpError('An error occurred while trying to hash new bot token..', 500));
    }

    existingBot.token = newHashedToken;

    try {
        await existingBot.save();
    }
    catch (e) {
        console.log(e.message);
        return next(new HttpError('An error occurred while trying to save a bot to db..', 500));
    }

    res.status(200);
    res.json({message: 'Successfully updated bot with id: ' + botId});
}

module.exports = {
    register,
    updateBot
}
const {Markup} = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');
const botConfig = require('../config.json');
const actions = require('../constants/action-constants');
const beatstoreService = new BeatstoreService();

const allLicensesMenu = async (ctx, next) => {
    ctx.session.currentLicense = null;

    let licenses;
    try {
        const response = await beatstoreService.getAllLicenses();
        licenses = response.data.licenses;
    } catch (e) {
        ctx.reply(e.message);
        return next();
    }

    await ctx.reply(
        '📝 <b>Licenses list: </b> \n\n',
        {
            reply_markup: {
                inline_keyboard: [
                    ...licenses.map(l => {
                        const buttonText = '📄 ' + l.label + ' | 💰 Price: ' + '$' + l.price;
                        return [Markup.callbackButton(buttonText, actions.GET_LICENSE_BY_ID + ' ' + l.id)];
                    }),
                ],
            },
            parse_mode: 'HTML',
        }
    );

    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {}
};

module.exports = {
    allLicensesMenu
};
const {Markup} = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');
const botConfig = require('../config.json');
const actions = require('../constants/action-constants');
const beatstoreService = new BeatstoreService();
const date = require('../util/date');

const allUsersMenu = async (ctx, next) => {
    ctx.session.currentUser = null;

    let usersCount;
    let users;
    try {
        const response = await beatstoreService.getAllUsers(0, botConfig.maxItemsPerPage);
        const usersCountResponse = await beatstoreService.getAllUsers(0, 9999);
        users = response.data.users;
        usersCount = usersCountResponse.data.users.length;
    } catch (e) {
        ctx.reply(e.response.data.message);
        return next();
    }

    const pagesAmount = Math.ceil(usersCount / botConfig.maxItemsPerPage);

    await ctx.reply(
        '👯 <b>Users list: </b> \n\n',
        {
            reply_markup: {
                inline_keyboard: [
                    ...users.map(u => {
                        const buttonText = '📬 Email: ' + u.email + ' | 📜 Username: ' + u.username;
                        return [Markup.callbackButton(buttonText, actions.GET_USER_BY_ID + ' ' + u.id)];
                    }),
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_USERS_PREVIOUS_PAGE),
                        Markup.callbackButton(`1 of ${pagesAmount}`, `1 of ${pagesAmount}`),
                        Markup.callbackButton('➡️', actions.MOVE_USERS_NEXT_PAGE)
                    ]
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
    allUsersMenu
};
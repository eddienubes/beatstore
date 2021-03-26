const date = require('../util/date');
const actions = require('../constants/action-constants');
const BeatstoreService = require('../services/beatstore-service');
const beatstoreService = new BeatstoreService();
const botConfig = require('../config.json');
const {Markup} = require('telegraf');
const hears = require('../hears');


const sendUserMessage = async (user, ctx, keyboard) => {
    if (!user) return;

    await ctx.reply(
        `👤 <b>USER DETAILS: </b>👤 \n\n` +
        `📝 <b>Username:</b> <i>${user.username}</i>\n\n` +
        `📬 <b>Email:</b> <i>${user.email}</i>\n` +
        `🔒 <b>Status: </b> <i>${user.status}</i>\n` +
        `💸 <b>Amount of purchased items: </b> <code>${user.purchased.length}</code>\n\n` +
        `➖➖➖➖➖➖➖➖➖➖\n\n` +
        `🔑 <b>Confirmation code: </b> <code>${user.confirmationCode}</code>\n`,
        {
            reply_markup: {
                inline_keyboard: [
                    [Markup.callbackButton('📦 Purchases', actions.GET_PURCHASED_LIST)],
                    [Markup.callbackButton('⬅ Back', actions.BACK_TO_ALL_USERS_MENU)],
                ]
            },
            parse_mode: 'HTML'
        });
}

const controlUserButtons = async (ctx, next) => {
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard;

    const currentPage = Number.parseInt(keyboard[keyboard.length - 1][1].callback_data.split(' ')[0]);
    const totalPages = Number.parseInt(keyboard[keyboard.length - 1][1].callback_data.split(' ')[2]);

    const action = ctx.callbackQuery.data;

    let nextPage;

    if (action === actions.MOVE_USERS_PREVIOUS_PAGE) {
        nextPage = currentPage - 1;
    } else if (action === actions.MOVE_USERS_NEXT_PAGE) {
        nextPage = currentPage + 1;
    }

    if (nextPage < 1 || nextPage > totalPages) {
        await ctx.answerCbQuery('You\'re on the last or first page!');
        return next();
    }

    let newUsers;
    try {
        const response = await beatstoreService.getAllUsers(
            (nextPage - 1) * botConfig.maxItemsPerPage,
            botConfig.maxItemsPerPage);
        newUsers = response.data.users;
    } catch (e) {
        await ctx.reply(e.response.data.message);
        return next();
    }
    try {
        await ctx.editMessageReplyMarkup({
                inline_keyboard: [
                    ...newUsers.map(u => {
                        const buttonText = '📬 Email: ' + u.email + ' | 📜 Username: ' + u.username;
                        return [Markup.callbackButton(buttonText, actions.GET_USER_BY_ID + ' ' + u.id)];
                    }),
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_USERS_PREVIOUS_PAGE),
                        Markup.callbackButton(`${nextPage} of ${totalPages}`, `${nextPage} of ${totalPages}`),
                        Markup.callbackButton('➡️', actions.MOVE_USERS_NEXT_PAGE)
                    ]
                ]
            }
        );
    } catch (e) {
    }
};

const getUserById = async (ctx, next) => {
    const userId = ctx.session.currentUser?.id || ctx.callbackQuery.data.split(' ')[1];

    let user;
    try {
        const response = await beatstoreService.getUserById(userId);
        user = response.data.user;
    } catch (e) {
        ctx.reply(e.response.data.message);
        return next();
    }

    ctx.session.currentUser = user;

    await sendUserMessage(user, ctx);

    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }
}

const backToAllUsersMenu = async (ctx, next) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }

    await hears.allUsersMenu(ctx, next);
}

const getAllPurchases = async (ctx, next) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {}

    const allPurchases = ctx.session.currentUser.purchased;

    const limitedPurchases = allPurchases.slice(0, botConfig.maxItemsPerPage);

    const pagesAmount = Math.ceil(allPurchases.length / botConfig.maxItemsPerPage);

    await ctx.reply(
        '📦 <b>Purchases list: </b>',
        {
            reply_markup: {
                inline_keyboard: [
                    ...limitedPurchases.map(p => {
                        const buttonText = '📄 License: ' + p.label + ' | 📅 Date: ' + date(p.date);
                        return [Markup.callbackButton(buttonText, actions.GET_PURCHASE_BY_ID + ' ' + p.id)];
                    }),
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_PURCHASES_PREVIOUS_PAGE),
                        Markup.callbackButton(`1 of ${pagesAmount}`, `1 of ${pagesAmount}`),
                        Markup.callbackButton('➡️', actions.MOVE_PURCHASES_NEXT_PAGE)
                    ],
                    [
                        Markup.callbackButton('⬅ Back to user details', actions.BACK_TO_USER),
                    ]
                ]
            },
            parse_mode: 'HTML'
        }
    );
}

const controlButtonsPurchases = async (ctx, next) => {
    if (!ctx.session.currentUser) {
        return next();
    }

    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard;

    const currentPage = Number.parseInt(keyboard[keyboard.length - 2][1].callback_data.split(' ')[0]);
    const totalPages = Number.parseInt(keyboard[keyboard.length - 2][1].callback_data.split(' ')[2]);

    const action = ctx.callbackQuery.data;

    let nextPage;

    if (action === actions.MOVE_PURCHASES_PREVIOUS_PAGE) {
        nextPage = currentPage - 1;
    } else if (action === actions.MOVE_PURCHASES_NEXT_PAGE) {
        nextPage = currentPage + 1;
    }

    if (nextPage < 1 || nextPage > totalPages) {
        await ctx.answerCbQuery('You\'re on the last or first page!');
        return next();
    }

    const newPurchases = ctx.session.currentUser.purchased
        .slice(
            (nextPage - 1) * botConfig.maxItemsPerPage,
            (nextPage - 1) * botConfig.maxItemsPerPage + botConfig.maxItemsPerPage);


    try {
        await ctx.editMessageReplyMarkup({
            inline_keyboard: [
                ...newPurchases.map(p => {
                    const buttonText = '📄 License: ' + p.label + ' | 📅 Date: ' + date(p.date);

                    return [Markup.callbackButton(buttonText, actions.GET_PURCHASE_BY_ID + ' ' + p.id)];
                }),
                [
                    Markup.callbackButton('⬅️', actions.MOVE_PURCHASES_PREVIOUS_PAGE),
                    Markup.callbackButton(`${nextPage} of ${totalPages}`, `${nextPage} of ${totalPages}`),
                    Markup.callbackButton('➡️', actions.MOVE_PURCHASES_NEXT_PAGE)
                ],
                [
                    Markup.callbackButton('⬅️Back to user details', actions.BACK_TO_USER),
                ]
            ]
        });
    } catch (e) {}
}

const backToUserDetails = async (ctx, next) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {}
    await getUserById(ctx, next);
}

const getPurchaseById = async (ctx, next) => {
    if (!ctx.session.currentUser) {
        return next();
    }
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {}

    const purchasedId = ctx.callbackQuery.data.split(' ')[1];
    const purchasedItem = ctx.session.currentUser.purchased.find(p => p.id === purchasedId);

    if (!purchasedItem) {
        await ctx.reply('❕ purchasedItem with such ID has not been found!\n');
        return next();
    }

    const mp3 = purchasedItem.links[0] ? `<a href="${purchasedItem.links[0]}">link</a>` : '<i>Not payed</i>';
    const wav = purchasedItem.links[1] ? `<a href="${purchasedItem.links[1]}">link</a>` : '<i>Not payed</i>';
    const stems = purchasedItem.links[2] ? `<a href="${purchasedItem.links[2]}">link</a>` : '<i>Not payed</i>';

    await ctx.reply(
        `🔑 <b>Product ID:</b> <code>${purchasedId}</code>\n` +
        `<b>${purchasedItem.label}</b>\n\n` +
        `📃 <b>Beat title: </b> <i>${purchasedItem.title}</i>\n` +
        `💰 <b>Price: </b> <i>$${purchasedItem.price}</i>\n` +
        `📆 <b>Date:</b> <i>${date(purchasedItem.date)}</i>\n` +
        `➖➖➖➖➖➖➖➖➖\n` +
        `🔗 <b>Links: </b>\n\n` +
        `💿 <b>MP3:</b> ${mp3}\n` +
        `💿 <b>WAV:</b> ${wav}\n` +
        `💿 <b>STEMS:</b> ${stems}\n`,
        {
            reply_markup: {
                inline_keyboard: [
                    [Markup.callbackButton('⬅ Back', actions.BACK_TO_PURCHASES_LIST)]
                ]
            },
            parse_mode: 'HTML'
        });

}

const backToAllUsersPurchases = async (ctx, next) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {}

    await getAllPurchases(ctx, next);
}

module.exports = {
    controlUserButtons,
    getUserById,
    backToAllUsersMenu,
    getAllPurchases,
    backToUserDetails,
    controlButtonsPurchases,
    getPurchaseById,
    backToAllUsersPurchases
}
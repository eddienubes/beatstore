const {Markup} = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');
const date = require('../util/date');
const actions = require('../constants/action-constants');
const beatstoreService = new BeatstoreService();

const allBeatsMenu = async (ctx, next) => {
    ctx.session.currentBeat = null;

    let beatsCount;
    let beats;
    try {
        const response = await beatstoreService.getAllBeats(0, process.env.maxItemsPerPage);

        const beatsCountResponse = await beatstoreService.getAllBeats(0, 9999);

        beats = response.data.beats;
        beatsCount = beatsCountResponse.data.beats.length;
    } catch (e) {
        await ctx.reply(e.message);
        return next();
    }

    const pagesAmount = Math.ceil(beatsCount / process.env.maxItemsPerPage);

    await ctx.reply(
        '🎸 <b>Beats list: </b> \n\n' +
        `<b>🌵 Total amount of uploaded beats: ${beatsCount} </b>`,
        {
            reply_markup: {
                inline_keyboard: [
                    ...beats.map(b => {
                        const today = date(b.loadTime);

                        const buttonText = '📋 ' + b.title + ' | 📅 Date: ' + today;

                        return [Markup.callbackButton(buttonText, actions.GET_BEAT_BY_ID + ' ' + b.id)];
                    }),
                    [
                        Markup.callbackButton('➕ Add', actions.ADD_NEW_BEAT)
                    ],
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_BEATS_PREVIOUS_PAGE),
                        Markup.callbackButton(`1 of ${pagesAmount}`, `1 of ${pagesAmount}`),
                        Markup.callbackButton('➡️', actions.MOVE_BEATS_NEXT_PAGE)
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
    allBeatsMenu
};
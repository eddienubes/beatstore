const WizardScene = require('telegraf/scenes/wizard');
const sceneNames = require('../constants/wizard-scenes-constants');
const {Markup} = require('telegraf');
const hears = require('../hears');
const actions = require('../actions');
const BeatstoreService = require('../services/beatstore-service');
const beatstoreService = new BeatstoreService();

const beatDeletionConfirmationScene = new WizardScene(sceneNames.BEAT_DELETION_SCENE,
    async (ctx, next) => {
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;

        await ctx.reply('⁉ Are you sure you want to delete this beat?', {
            reply_markup: {
                inline_keyboard: [
                    [
                        Markup.callbackButton('👍 Yes', 'yes'),
                        Markup.callbackButton('⛔ No', 'no'),
                    ]
                ]
            },
            parse_mode: 'HTML'
        })
    }
)

beatDeletionConfirmationScene.action('yes', async (ctx, next) => {
    try {
        await beatstoreService.deleteBeaById(ctx.session.currentBeat.id);
    }
    catch (e) {
        console.log(e.response.data.message);
        await ctx.reply(e.response.data.message);
        return ctx.scene.leave();
    }

    await ctx.reply('✅ Beat has been successfully deleted!');
    await ctx.deleteMessage(ctx.wizard.state.message_id);
    await hears.allBeatsMenu(ctx, next);
    return ctx.scene.leave();
});


beatDeletionConfirmationScene.action('no', async (ctx, next) => {
    await ctx.deleteMessage(ctx.wizard.state.message_id);
    await actions.getBeatById(ctx, next);
    return ctx.scene.leave();
});

module.exports = {
    beatDeletionConfirmationScene
}

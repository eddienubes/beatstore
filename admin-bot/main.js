const {Telegraf, session, Stage} = require('telegraf');
const WizardScene = require('telegraf/scenes/wizard');
const actions = require('./actions');
const actionNames = require('./constants/action-constants');
const commands = require('./commands');
const hears = require('./hears');
const scenes = require('./scenes');
const sceneNames = require('./constants/wizard-scenes-constants');
require('dotenv').config();


const bot = new Telegraf(process.env.token);

bot.on(["message"], async (ctx, next) => {
    if (ctx.message.from.id.toString() !== process.env.adminId) {
        return await ctx.reply('Your not allowed to use this bot!');
    }
    return await next();
});

const stage = new Stage([
    scenes.editTitleScene,
    scenes.editBPMScene,
    scenes.editScaleScene,
    scenes.editImageScene,
    scenes.editPreviewAudioScene,
    scenes.editMP3UrlScene,
    scenes.editWavUrlScene,
    scenes.editSTEMSUrlScene,
    scenes.editTagsScene,
    scenes.editMoodsScene,
    scenes.editGenresScene,
    scenes.beatDeletionConfirmationScene,
    scenes.createNewBeatScene,
    scenes.editLicensePrice,
    scenes.editLicenseLabel
]);

bot.use(session());
bot.use(stage.middleware());

bot.start(commands.mainMenu);
bot.command('register', commands.register);
bot.command('update', commands.updateBotToken);

bot.action(new RegExp(actionNames.GET_BEAT_BY_ID), actions.getBeatById);
bot.action([actionNames.MOVE_BEATS_NEXT_PAGE, actionNames.MOVE_BEATS_PREVIOUS_PAGE], actions.controlButtons);
bot.action(actionNames.BACK_TO_ALL_BEATS_MENU, hears.allBeatsMenu);
bot.action(actionNames.EDIT_CURRENT_BEAT, actions.editBeatMenu);
bot.action(actionNames.BACK_FROM_EDITING_BEAT_TO_BEAT, actions.backFromEditingToBeat);
bot.action([
    actionNames.EDIT_BEAT_TITLE,
    actionNames.EDIT_BEAT_BPM,
    actionNames.EDIT_BEAT_SCALE,
    actionNames.EDIT_BEAT_TAGS,
    actionNames.EDIT_BEAT_MP3_URL,
    actionNames.EDIT_BEAT_WAV_URL,
    actionNames.EDIT_BEAT_STEMS_URL,
    actionNames.EDIT_BEAT_PREVIEW_AUDIO_URL,
    actionNames.EDIT_BEAT_IMG_URL,
    actionNames.EDIT_BEAT_GENRES,
    actionNames.EDIT_BEAT_MOODS
], actions.editBeat);
bot.action(actionNames.DELETE_CURRENT_BEAT, actions.deleteCurrentBeat);
bot.action(actionNames.LISTEN_TO_CURRENT_BEAT, actions.listenToCurrentBeat);
bot.action(actionNames.ADD_NEW_BEAT, actions.createNewBeat);
bot.action(new RegExp(actionNames.GET_LICENSE_BY_ID, 'gi'), actions.getLicenseById);
bot.action(actionNames.EDIT_CURRENT_LICENSE, actions.editLicenseMenu);
bot.action(actionNames.BACK_FROM_EDITING_LICENSE_TO_LICENSE, actions.backFromEditingLicenseToLicense);
bot.action(actionNames.BACK_FROM_LICENSE_TO_ALL_LICENSES_MENU, hears.allLicensesMenu);
bot.action([
    actionNames.EDIT_LICENSE_LABEL,
    actionNames.EDIT_LICENSE_PRICE
], actions.editLicense);
bot.action([actionNames.MOVE_ORDERS_NEXT_PAGE, actionNames.MOVE_ORDERS_PREVIOUS_PAGE], actions.controlOrdersButtons);
bot.action(new RegExp(actionNames.GET_ORDER_BY_ID, 'gi'), actions.getOrderById);
bot.action(actionNames.GET_ORDER_CUSTOMER, actions.getOrderCustomer);
bot.action(actionNames.GET_ORDER_PRODUCTS, actions.getOrderProducts);
bot.action([
    actionNames.MOVE_ORDER_PRODUCTS_PREVIOUS_PAGE,
    actionNames.MOVE_ORDER_PRODUCTS_NEXT_PAGE
], actions.controlOrderProductsButtons);
bot.action(actionNames.BACK_TO_ORDER, actions.backToOrder);
bot.action(actionNames.BACK_FROM_ORDER_TO_ORDER_MENU, actions.backFromOrderToOrderMenu);
bot.action(new RegExp(actionNames.GET_PRODUCT_BY_ID, 'gi'), actions.getProductById);
bot.action(actionNames.BACK_TO_PRODUCTS, actions.backToProducts);
bot.action([
    actionNames.MOVE_USERS_NEXT_PAGE,
    actionNames.MOVE_USERS_PREVIOUS_PAGE
], actions.controlUserButtons);
bot.action(new RegExp(actionNames.GET_USER_BY_ID, 'gi'), actions.getUserById);
bot.action(actionNames.GET_PURCHASED_LIST, actions.getAllPurchases);
bot.action(actionNames.BACK_TO_ALL_USERS_MENU, actions.backToAllUsersMenu);
bot.action(actionNames.BACK_TO_USER, actions.backToUserDetails);
bot.action([
    actionNames.MOVE_PURCHASES_NEXT_PAGE,
    actionNames.MOVE_PURCHASES_PREVIOUS_PAGE
], actions.controlButtonsPurchases);
bot.action(actionNames.BACK_TO_PURCHASES_LIST, actions.backToAllUsersPurchases);
bot.action(new RegExp(actionNames.GET_PURCHASE_BY_ID, 'gi'), actions.getPurchaseById);

bot.hears(new RegExp('Beats', 'gi'), hears.allBeatsMenu)
bot.hears(new RegExp('Licenses', 'gi'), hears.allLicensesMenu);
bot.hears(new RegExp('Orders', 'gi'), hears.allOrdersMenu);
bot.hears(new RegExp('Users', 'gi'), hears.allUsersMenu);

bot.telegram.callApi('getUpdates', {offset: -1})
    .then(updates => updates.length && updates[0].update_id + 1)
    .catch(e => console.log(e))
    .then(offset => {
        if (offset) return bot.telegram.callApi('getUpdates', {offset})
    })
    .then(() => bot.launch())
    .then(() => console.info('Bot is up and running on port ' + process.env.port))
    .catch(err => console.error(err + ' by BOT'));

process.once('SIGINT', async () => await bot.stop());
process.once('SIGTERM', async () => await bot.stop());



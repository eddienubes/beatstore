const { Markup } = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');
const actions = require('../constants/action-constants');
const sceneNames = require('../constants/wizard-scenes-constants');

const beatstoreService = new BeatstoreService();

const getLicenseById = async (ctx, next) => {
  const licenseId = ctx.session.currentLicense?.id || ctx.callbackQuery.data.split(' ')[1];

  let license;
  try {
    const response = await beatstoreService.getLicenseById(licenseId);
    license = response.data.license;
  } catch (e) {
    console.log(e.message);
    await ctx.reply(e.message);
    return next();
  }

  ctx.session.currentLicense = license;

  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  } catch (e) {
    // no-op
  }

  await ctx.reply(
    `📄 <b>${license.label}</b>\n\n` +
      `💰 <b>Price:</b> <i>$${license.price}</i>\n` +
      `⚙ <b>Type:</b> <i>${license.type}</i>\n` +
      `📈 <b>Orders made with this license:</b> <i>${license.orders}</i>\n\n`,
    {
      reply_markup: {
        inline_keyboard: [
          [Markup.callbackButton('✏ Edit', actions.EDIT_CURRENT_LICENSE)],
          [Markup.callbackButton('⬅ Back', actions.BACK_FROM_LICENSE_TO_ALL_LICENSES_MENU)]
        ]
      },
      parse_mode: 'HTML'
    }
  );
};

const editLicenseMenu = async (ctx, next) => {
  await ctx.editMessageReplyMarkup(
    Markup.inlineKeyboard([
      [Markup.callbackButton('✏ Edit label 📃', actions.EDIT_LICENSE_LABEL)],
      [Markup.callbackButton('✏ Edit price 💵', actions.EDIT_LICENSE_PRICE)],
      [Markup.callbackButton('⬅ Back', actions.BACK_FROM_EDITING_LICENSE_TO_LICENSE)]
    ])
  );
};

const backFromEditingLicenseToLicense = async (ctx, next) => {
  await getLicenseById(ctx, next);
};

const editLicense = async (ctx, next) => {
  let sceneNameToEnter;

  switch (ctx.callbackQuery.data) {
    case actions.EDIT_LICENSE_PRICE:
      sceneNameToEnter = sceneNames.EDIT_LICENSE_PRICE_SCENE;
      break;
    case actions.EDIT_LICENSE_LABEL:
      sceneNameToEnter = sceneNames.EDIT_LICENSE_LABEL_SCENE;
      break;
    default:
      break;
  }

  return await ctx.scene.enter(sceneNameToEnter);
};

module.exports = {
  getLicenseById,
  editLicenseMenu,
  backFromEditingLicenseToLicense,
  editLicense
};

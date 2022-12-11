const WizardScene = require('telegraf/scenes/wizard');
const BeatstoreService = require('../services/beatstore-service');

const beatstoreService = new BeatstoreService();
const sceneNames = require('../constants/wizard-scenes-constants');
const actions = require('../actions');

const editLicenseLabel = new WizardScene(
  sceneNames.EDIT_LICENSE_LABEL_SCENE,
  async (ctx) => {
    ctx.wizard.state.messageId = ctx.callbackQuery.message.message_id;

    await ctx.reply('📄 Enter new label: ', {
      reply_markup: {
        force_reply: true
      }
    });

    return ctx.wizard.next();
  },
  async (ctx, next) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Invalid license label!');
    } else {
      try {
        await beatstoreService.updateLicenseById(ctx.session.currentLicense.id, {
          label: ctx.message.text
        });
      } catch (e) {
        console.log(e.response.data);
        await ctx.reply(e.response.data.message);
        return ctx.scene.leave();
      }

      await ctx.reply('✅ <b> Label has been successfully changed! </b>', { parse_mode: 'HTML' });
      await actions.getLicenseById(ctx, next);
      try {
        await ctx.deleteMessage(ctx.wizard.state.messageId);
      } catch (e) {
        // no-op
      }

      return await ctx.scene.leave();
    }
  }
);

const editLicensePrice = new WizardScene(
  sceneNames.EDIT_LICENSE_PRICE_SCENE,
  async (ctx) => {
    ctx.wizard.state.messageId = ctx.callbackQuery.message.message_id;

    await ctx.reply('💰 Enter new price: ', {
      reply_markup: {
        force_reply: true
      }
    });

    return ctx.wizard.next();
  },
  async (ctx, next) => {
    if (!ctx?.message?.text || !parseFloat(ctx.message.text)) {
      await ctx.reply('❗ Invalid license price!');
    } else {
      const price = parseFloat(ctx.message.text);

      try {
        await beatstoreService.updateLicenseById(ctx.session.currentLicense.id, {
          price
        });
      } catch (e) {
        console.log(e.response.data);
        await ctx.reply(e.response.data.message);
        return ctx.scene.leave();
      }

      await ctx.reply('✅ <b> Price has been successfully changed! </b>', { parse_mode: 'HTML' });
      await actions.getLicenseById(ctx, next);
      try {
        await ctx.deleteMessage(ctx.wizard.state.messageId);
      } catch (e) {
        // no-op
      }

      return await ctx.scene.leave();
    }
  }
);

module.exports = {
  editLicenseLabel,
  editLicensePrice
};

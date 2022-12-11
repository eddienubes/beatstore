const { Markup } = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');

const beatstoreService = new BeatstoreService();

const initialState = {
  currentBeat: null
};

const mainMenu = async (ctx, next) => {
  ctx.session = initialState;
  await ctx.reply(
    '👋 Welcome to admin panel!',
    Markup.keyboard([
      Markup.button('🎙 Beats'),
      Markup.button('📝 Licenses'),
      Markup.button('🤑 Orders'),
      Markup.button('👨‍ Users')
    ]).extra()
  );
};

const register = async (ctx, next) => {
  try {
    const response = await beatstoreService.register();
  } catch (e) {
    // console.log(e.response);
    await ctx.reply(e.response.data.message);
    return next();
  }

  await ctx.reply('⭐ Successfully registered!');
};

const updateBotToken = async (ctx, next) => {
  const newToken = ctx.message?.text.split(' ')[1];

  if (!newToken) {
    await ctx.reply('❗ Please, specify old token!');
    return next();
  }
  try {
    await ctx.deleteMessage(ctx.message.message_id);
  } catch (e) {
    // no-op
  }
  try {
    const response = await beatstoreService.updateToken(newToken);
  } catch (e) {
    // console.log(e.response);
    await ctx.reply(e.response.data.message);
    return next();
  }

  await ctx.reply('⭐ Successfully updated bot token!');
};

module.exports = {
  mainMenu,
  register,
  updateBotToken
};

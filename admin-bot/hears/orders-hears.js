const { Markup } = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');
const actions = require('../constants/action-constants');

const beatstoreService = new BeatstoreService();
const date = require('../util/date');

const allOrdersMenu = async (ctx, next) => {
  ctx.session.currentOrder = null;

  let ordersCount;
  let orders;
  try {
    const response = await beatstoreService.getAllOrders(0, process.env.MAX_ITEMS_PER_PAGE);
    const beatsCountResponse = await beatstoreService.getAllOrders(0, 9999);
    orders = response.data.orders;
    ordersCount = beatsCountResponse.data.orders.length;
  } catch (e) {
    await ctx.reply(e.response?.data?.message);
    return next();
  }

  const pagesAmount = Math.ceil(ordersCount / process.env.MAX_ITEMS_PER_PAGE);

  await ctx.reply('🤑 <b>Orders list: </b> \n\n', {
    reply_markup: {
      inline_keyboard: [
        ...orders.map((o) => {
          const today = date(o.date);
          const buttonText = `📬 Email: ${o.email} | 📅 Date: ${today}`;
          return [Markup.callbackButton(buttonText, `${actions.GET_ORDER_BY_ID} ${o.id}`)];
        }),
        [
          Markup.callbackButton('⬅️', actions.MOVE_ORDERS_PREVIOUS_PAGE),
          Markup.callbackButton(`1 of ${pagesAmount}`, `1 of ${pagesAmount}`),
          Markup.callbackButton('➡️', actions.MOVE_ORDERS_NEXT_PAGE)
        ]
      ]
    },
    parse_mode: 'HTML'
  });

  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  } catch (e) {
    // no-op
  }
};

module.exports = {
  allOrdersMenu
};

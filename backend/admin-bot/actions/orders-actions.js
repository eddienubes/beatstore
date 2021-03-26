const date = require('../util/date');
const actions = require('../constants/action-constants');
const BeatstoreService = require('../services/beatstore-service');
const beatstoreService = new BeatstoreService();
const botConfig = require('../config.json');
const {Markup} = require('telegraf');
const hears = require('../hears');

const sendOrderMessage = async (order, ctx, keyboard) => {
    if (!order) return;

    await ctx.reply(
        `📜 <b>ORDER DETAILS: </b>📜 \n\n` +
        `📅 <b>Date:</b> <i>${date(order.date)}</i>\n` +
        `📬 <b>Email:</b> <i>${order.email}</i>\n` +
        `💰 <b>Total: </b> <i>${order.total.toFixed(2)}</i>\n` +
        `🔑 <b>ID: </b> <code>${order.id}</code>\n`,
        {
            reply_markup: {
                inline_keyboard: [
                    [Markup.callbackButton('📦 Products', actions.GET_ORDER_PRODUCTS)],
                    [Markup.callbackButton('👱‍♂ Customer', actions.GET_ORDER_CUSTOMER)],
                    [Markup.callbackButton('⬅ Back', actions.BACK_FROM_ORDER_TO_ORDER_MENU)],
                ]
            },
            parse_mode: 'HTML'
        });

}

const controlOrdersButtons = async (ctx, next) => {
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard;

    const currentPage = Number.parseInt(keyboard[keyboard.length - 1][1].callback_data.split(' ')[0]);
    const totalPages = Number.parseInt(keyboard[keyboard.length - 1][1].callback_data.split(' ')[2]);

    const action = ctx.callbackQuery.data;

    let nextPage;

    if (action === actions.MOVE_ORDERS_PREVIOUS_PAGE) {
        nextPage = currentPage - 1;
    } else if (action === actions.MOVE_ORDERS_NEXT_PAGE) {
        nextPage = currentPage + 1;
    }

    if (nextPage < 1 || nextPage > totalPages) {
        await ctx.answerCbQuery('You\'re on the last or first page!');
        return next();
    }

    let newOrders;
    try {
        const response = await beatstoreService.getAllOrders(
            (nextPage - 1) * botConfig.maxItemsPerPage,
            botConfig.maxItemsPerPage);
        newOrders = response.data.orders;
    } catch (e) {
        await ctx.reply(e.response.data.message);
        return next();
    }
    try {
        await ctx.editMessageReplyMarkup({
                inline_keyboard: [
                    ...newOrders.map(o => {
                        const today = date(o.date);
                        const buttonText = '📬 Email: ' + o.email + ' | 📅 Date: ' + today;
                        return [Markup.callbackButton(buttonText, actions.GET_ORDER_BY_ID + ' ' + o.id)];
                    }),
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_ORDERS_PREVIOUS_PAGE),
                        Markup.callbackButton(`${nextPage} of ${totalPages}`, `${nextPage} of ${totalPages}`),
                        Markup.callbackButton('➡️', actions.MOVE_ORDERS_NEXT_PAGE)
                    ]]
            }
        );
    } catch (e) {
    }

};

const getOrderById = async (ctx, next) => {
    const orderId = ctx.session.currentOrder?.id || ctx.callbackQuery.data.split(' ')[1];

    let order;
    try {
        const response = await beatstoreService.getOrderById(orderId);
        order = response.data.order;
    } catch (e) {
        ctx.reply(e.response.data.message);
        return next();
    }

    ctx.session.currentOrder = order;

    await sendOrderMessage(order, ctx);

    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }
}


const getOrderCustomer = async (ctx, next) => {
    if (!ctx.session.currentOrder.customer) {
        await ctx.reply('❕ This customer has not registered yet!\n');
        return next();
    }

    const customer = ctx.session.currentOrder.customer;

    await ctx.editMessageText(
        `📬 <b>Username: </b><i>${customer.username}</i>\n\n` +
        `📰 <b>Email: </b><i>${customer.email}</i>\n` +
        `🔐 <b>Status: </b><i>${customer.status}</i>\n` +
        `🔑 <b>Admin: </b><i>${customer.isAdmin}</i>\n`,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [Markup.callbackButton('⬅ Back', actions.BACK_TO_ORDER)]
                ]
            }
        }
    )

}

const getOrderProducts = async (ctx, next) => {
    if (!ctx.session.currentOrder) {
        return next();
    }
    const allProducts = ctx.session.currentOrder.products;

    const limitedProducts = allProducts.slice(0, botConfig.maxItemsPerPage);

    const pagesAmount = Math.ceil(allProducts.length / botConfig.maxItemsPerPage);
    await ctx.reply(
        '📦 <b>Products list: </b> \n\n',
        {
            reply_markup: {
                inline_keyboard: [
                    ...limitedProducts.map(p => {
                        const buttonText = '📄 License: ' + p.label + ' | 🎷 Beat: ' + p.title;
                        return [Markup.callbackButton(buttonText, actions.GET_PRODUCT_BY_ID + ' ' + p.id)];
                    }),
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_ORDER_PRODUCTS_PREVIOUS_PAGE),
                        Markup.callbackButton(`1 of ${pagesAmount}`, `1 of ${pagesAmount}`),
                        Markup.callbackButton('➡️', actions.MOVE_ORDER_PRODUCTS_NEXT_PAGE)
                    ],
                    [
                        Markup.callbackButton('⬅ Back to order', actions.BACK_TO_ORDER)
                    ]
                ],
            },
            parse_mode: 'HTML',
        }
    );

    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }
}
const controlOrderProductsButtons = async (ctx, next) => {
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard;

    const currentPage = Number.parseInt(keyboard[keyboard.length - 2][1].callback_data.split(' ')[0]);
    const totalPages = Number.parseInt(keyboard[keyboard.length - 2][1].callback_data.split(' ')[2]);

    const action = ctx.callbackQuery.data;

    let nextPage;

    if (action === actions.MOVE_ORDER_PRODUCTS_PREVIOUS_PAGE) {
        nextPage = currentPage - 1;
    } else if (action === actions.MOVE_ORDER_PRODUCTS_NEXT_PAGE) {
        nextPage = currentPage + 1;
    }

    if (nextPage < 1 || nextPage > totalPages) {
        await ctx.answerCbQuery('You\'re on the last or first page!');
        return next();
    }

    const newProducts = ctx.session.currentOrder.products
        .slice(
            (nextPage - 1) * botConfig.maxItemsPerPage,
            (nextPage - 1) * botConfig.maxItemsPerPage + botConfig.maxItemsPerPage);


    try {
        await ctx.editMessageReplyMarkup({
            inline_keyboard: [
                ...newProducts.map(p => {
                    const buttonText = '📄 License: ' + p.label + ' | 🎷 Beat: ' + p.title;
                    return [Markup.callbackButton(buttonText, actions.GET_PRODUCT_BY_ID + ' ' + p.id)];
                }),
                [
                    Markup.callbackButton('⬅️', actions.MOVE_ORDER_PRODUCTS_PREVIOUS_PAGE),
                    Markup.callbackButton(`${nextPage} of ${totalPages}`, `${nextPage} of ${totalPages}`),
                    Markup.callbackButton('➡️', actions.MOVE_ORDER_PRODUCTS_NEXT_PAGE)
                ],
                [
                    Markup.callbackButton('⬅ Back to order', actions.BACK_TO_ORDER)
                ]
            ],
        });
    } catch (e) {
    }
}

const backToOrder = async (ctx, next) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }

    await sendOrderMessage(ctx.session.currentOrder, ctx);
}


const backFromOrderToOrderMenu = async (ctx, next) => {
    await hears.allOrdersMenu(ctx, next);
}

const getProductById = async (ctx, next) => {
    if (!ctx.session.currentOrder) {
        return next();
    }
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {}
    const productId = ctx.callbackQuery.data.split(' ')[1];

    const product = ctx.session.currentOrder.products.find(p => p.id === productId);

    if (!product) {
        await ctx.reply('❕ Product with such ID has not been found!\n');
        return next();
    }

    const mp3 = product.links[0] ? `<a href="${product.links[0]}">link</a>` : '<i>Not payed</i>';
    const wav = product.links[1] ? `<a href="${product.links[1]}">link</a>` : '<i>Not payed</i>';
    const stems = product.links[2] ? `<a href="${product.links[2]}">link</a>` : '<i>Not payed</i>';

    await ctx.reply(
        `🔑 <b>Product ID:</b> <code>${productId}</code>\n` +
        `<b>${product.label}</b>\n\n` +
        `📃 <b>Beat title: </b> <i>${product.title}</i>\n` +
        `💰 <b>Price: </b> <i>$${product.price}</i>\n` +
        `📆 <b>Date:</b> <i>${date(product.date)}</i>\n` +
        `➖➖➖➖➖➖➖➖➖\n` +
        `🔗 <b>Links: </b>\n\n` +
        `💿 <b>MP3:</b> ${mp3}\n` +
        `💿 <b>WAV:</b> ${wav}\n` +
        `💿 <b>STEMS:</b> ${stems}\n`,
        {
            reply_markup: {
                inline_keyboard: [
                    [Markup.callbackButton('⬅ Back', actions.BACK_TO_PRODUCTS)]
                ]
            },
            parse_mode: 'HTML'
        });
};


const backToProducts = async (ctx, next) => {
    try {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    } catch (e) {
    }

    await getOrderProducts(ctx, next);
}

module.exports = {
    controlOrdersButtons,
    getOrderById,
    getOrderCustomer,
    getOrderProducts,
    controlOrderProductsButtons,
    backToOrder,
    getProductById,
    backToProducts,
    backFromOrderToOrderMenu
}
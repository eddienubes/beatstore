const {Telegraf, Markup} = require('telegraf');
const botConfig = require('./config.json');
const generalConfig = require('../config.json');
const axios = require('axios');
const url = require('url');

module.exports = async () => {
    const bot = new Telegraf(botConfig.token);

    // bot.use(Telegraf.log());

    bot.on('text', (ctx, next) => {
        if (ctx.update.message.from.id.toString() !== botConfig.adminId) {
            ctx.reply('🔒 You are not allowed to use admin panel! 🔒');
        } else {
            return next();
        }
    });

    bot.start(ctx => {
        ctx.reply('Welcome to admin panel',
            Markup.keyboard([
                Markup.button.callback('Beats'),
                Markup.button.callback('Licenses'),
                Markup.button.callback('Orders'),
                Markup.button.callback('Users')
            ])
        );
    });

    bot.hears('Beats', async (ctx, next) => {
        const baseUrl = 'http://localhost:5000/api/beats';
        const requestUrl = new url.URL(baseUrl);
        requestUrl.searchParams.append('skip', '0');
        requestUrl.searchParams.append('limit', '5');

        console.log(requestUrl.href);

        let beats;
        try {
            const response = await axios.get(requestUrl.href);
            beats = response.data.beats;
        } catch (e) {
            ctx.reply(e.message);
            return next();
        }

        // [[button], [button]]

        ctx.reply(
            '🎵Beats list: ',
            Markup.inlineKeyboard([
                ...beats.map(b => {
                    let dd = new Date(b.loadTime).getDate();
                    let mm = new Date(b.loadTime).getMonth() + 1;
                    let yyyy = new Date(b.loadTime).getFullYear();

                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    const today = dd + '/' + mm + '/' + yyyy;

                    const buttonText = '📋 ' + b.title + ' | 📅 Date: ' + today;
                    return [Markup.button.callback(buttonText, b.title)];
                }), [Markup.button.callback('<', '<'), Markup.button.callback('1 of 1', '1 of 1'), Markup.button.callback('>', '>')]])
        );
    });
    
    await bot.launch();

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))

    console.log('Bot is up and running on port ' + generalConfig.port);
}
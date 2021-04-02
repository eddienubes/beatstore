const {Markup} = require('telegraf');
const BeatstoreService = require('../services/beatstore-service');
const botConfig = require('../config.json');
const generalConfig = require('../../backend/config.json');
const date = require('../util/date');
const actions = require('../constants/action-constants');
const path = require('path');
const sceneNames = require('../constants/wizard-scenes-constants');
const beatstoreService = new BeatstoreService();
const url = require('url');
const axios = require('axios');
const fs = require('fs');

const sendBeatMessage = async (beat, ctx, keyboard) => {
    if (!beat) return;
    await ctx.replyWithPhoto(
        'https://picsum.photos/200/300', {
            caption:
                `📋 <b>${beat.title}</b>\n\n` +
                `🎹 <b>BPM:</b> ${beat.bpm}\n` +
                `🎵 <b>Scale:</b> ${beat.scale}\n` +
                `🏷️ <b>Tags:</b> ${beat.tags.map(t => '#' + t).join(' ')}\n` +
                `🪕 <b>Genres:</b> ${beat.genres.map(t => '#' + t).join(' ')}\n` +
                `🎨 <b>Moods:</b> ${beat.moods.map(t => '#' + t).join(' ')}\n` +
                `💽 <b>MP3 Url:</b> <a href="${(generalConfig.currentIP + 'api/' + beat.mp3Url).replace(/\\/g, '/')}">link</a>\n` +
                `💽 <b>Wav Url</b> <a href="${(generalConfig.currentIP + 'api/' + beat.wavUrl).replace(/\\/g, '/')}">link</a>\n` +
                `💽 <b>STEMS Url:</b> <a href="${(generalConfig.currentIP + 'api/' + beat.stemsUrl).replace(/\\/g, '/')}">link</a>\n` +
                `⏱️<b>Load time:</b> ${date(beat.loadTime)}\n` +
                `⌛️<b>Duration:</b> ${beat.duration}\n`,
            reply_markup: {
                inline_keyboard: keyboard,
            },
            parse_mode: 'HTML'
        });
}


const controlButtons = async (ctx, next) => {
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard;

    const currentPage = Number.parseInt(keyboard[keyboard.length - 1][1].callback_data.split(' ')[0]);
    const totalPages = Number.parseInt(keyboard[keyboard.length - 1][1].callback_data.split(' ')[2]);

    const action = ctx.callbackQuery.data;

    let nextPage;

    if (action === actions.MOVE_BEATS_PREVIOUS_PAGE) {
        nextPage = currentPage - 1;
    } else if (action === actions.MOVE_BEATS_NEXT_PAGE) {
        nextPage = currentPage + 1;
    }

    if (nextPage < 1 || nextPage > totalPages) {
        await ctx.answerCbQuery('You\'re on the last or first page!');
        return next();
    }

    let newBeats;
    try {
        const response = await beatstoreService.getAllBeats(
            (nextPage - 1) * botConfig.maxItemsPerPage,
            botConfig.maxItemsPerPage);
        newBeats = response.data.beats;
    } catch (e) {
        ctx.reply(e.message);
        return next();
    }

    try {
        await ctx.editMessageReplyMarkup({
                inline_keyboard: [
                    ...newBeats.map(b => {
                        const today = date(b.loadTime);

                        const buttonText = '📋 ' + b.title + ' | 📅 Date: ' + today;

                        return [Markup.callbackButton(buttonText, actions.GET_BEAT_BY_ID + ' ' + b.id)];
                    }),
                    [
                        Markup.callbackButton('➕ Add', actions.ADD_NEW_BEAT)
                    ],
                    [
                        Markup.callbackButton('⬅️', actions.MOVE_BEATS_PREVIOUS_PAGE),
                        Markup.callbackButton(`${nextPage} of ${totalPages}`, `${nextPage} of ${totalPages}`),
                        Markup.callbackButton('➡️', actions.MOVE_BEATS_NEXT_PAGE)
                    ]]
            }
        );
    }
    catch (e) {}

};

const getBeatById = async (ctx, next) => {
    const beatId = ctx.session.currentBeat?.id || ctx.callbackQuery.data.split(' ')[1];

    let beat;
    try {
        const response = await beatstoreService.getBeatById(beatId)
        beat = response.data.beat;
    } catch (e) {
        ctx.reply(e.message);
        return next();
    }

    ctx.session.currentBeat = beat;

    const keyboard = [
        [Markup.callbackButton('✏️ Edit', actions.EDIT_CURRENT_BEAT)],
        [Markup.callbackButton('🎧  Listen', actions.LISTEN_TO_CURRENT_BEAT)],
        [Markup.callbackButton('❌  Delete', actions.DELETE_CURRENT_BEAT)],
        [Markup.callbackButton('⬅ Back', actions.BACK_TO_ALL_BEATS_MENU)],
    ];

    await sendBeatMessage(beat, ctx, keyboard);

    if (ctx.callbackQuery) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    }
};

const editBeatMenu = async (ctx, next) => {
    const beat = ctx.session.currentBeat;

    const keyboard = [
        [Markup.callbackButton('📋 Title', actions.EDIT_BEAT_TITLE)],
        [Markup.callbackButton('🎧 BPM', actions.EDIT_BEAT_BPM)],
        [Markup.callbackButton('🎹 Scale', actions.EDIT_BEAT_SCALE)],
        [Markup.callbackButton('🏷️ Tags', actions.EDIT_BEAT_TAGS)],
        [Markup.callbackButton('🪕 Genres', actions.EDIT_BEAT_GENRES)],
        [Markup.callbackButton('🎨 Moods', actions.EDIT_BEAT_MOODS)],
        [Markup.callbackButton('🖼️ Image', actions.EDIT_BEAT_IMG_URL)],
        [Markup.callbackButton('🖼️ Preview Audio', actions.EDIT_BEAT_PREVIEW_AUDIO_URL)],
        [Markup.callbackButton('💽 MP3 Url ', actions.EDIT_BEAT_MP3_URL)],
        [Markup.callbackButton('💽 Wav Url ', actions.EDIT_BEAT_WAV_URL)],
        [Markup.callbackButton('💽 STEMS Url ', actions.EDIT_BEAT_STEMS_URL)],
        [Markup.callbackButton('⬅ Back ', actions.BACK_FROM_EDITING_BEAT_TO_BEAT)]
    ];

    await sendBeatMessage(beat, ctx, keyboard);

    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
}

const backFromEditingToBeat = async (ctx, next) => {
    await getBeatById(ctx, next);
}


const editBeat = async (ctx, next) => {
    if (!ctx.session.currentBeat) {
        return next();
    }
    let sceneNameToEnter;
    switch (ctx.callbackQuery.data) {
        case actions.EDIT_BEAT_TITLE:
            sceneNameToEnter = sceneNames.EDIT_BEAT_TITLE_SCENE;
            break;
        case actions.EDIT_BEAT_BPM:
            sceneNameToEnter = sceneNames.EDIT_BEAT_BPM_SCENE;
            break;
        case actions.EDIT_BEAT_SCALE:
            sceneNameToEnter = sceneNames.EDIT_BEAT_SCALE_SCENE;
            break;
        case actions.EDIT_BEAT_TAGS:
            sceneNameToEnter = sceneNames.EDIT_BEAT_TAGS_SCENE;
            break;
        case actions.EDIT_BEAT_IMG_URL:
            sceneNameToEnter = sceneNames.EDIT_BEAT_IMG_URL_SCENE;
            break;
        case actions.EDIT_BEAT_PREVIEW_AUDIO_URL:
            sceneNameToEnter = sceneNames.EDIT_BEAT_PREVIEW_AUDIO_URL_SCENE;
            break;
        case actions.EDIT_BEAT_MP3_URL:
            sceneNameToEnter = sceneNames.EDIT_BEAT_MP3_URL_SCENE;
            break;
        case actions.EDIT_BEAT_WAV_URL:
            sceneNameToEnter = sceneNames.EDIT_BEAT_WAV_URL_SCENE;
            break;
        case actions.EDIT_BEAT_STEMS_URL:
            sceneNameToEnter = sceneNames.EDIT_BEAT_STEMS_URL_SCENE;
            break;
        case actions.EDIT_BEAT_MOODS:
            sceneNameToEnter = sceneNames.EDIT_BEAT_MOODS_SCENE;
            break;
        case actions.EDIT_BEAT_GENRES:
            sceneNameToEnter = sceneNames.EDIT_BEAT_GENRES_SCENE;
            break;
        default:
            return next();
    }
    await ctx.scene.enter(sceneNameToEnter);
}

const listenToCurrentBeat = async (ctx, next) => {
    const beatId = ctx.session.currentBeat.id;

    let beat;
    try {
        const response = await beatstoreService.getBeatById(beatId);
        beat = response.data.beat;
    }
    catch (e) {
        console.log(e.response.data.message);
        await ctx.reply(e.message);
        return next();
    }
    const audioUrl = new url.URL(beat.previewAudioUrl, generalConfig.currentIP + 'api/');


    await ctx.replyWithAudio(audioUrl.href, {
        caption: `📋 <b>${beat.title}</b> 📋\n\n`,
        parse_mode: 'HTML'
    });
}

const deleteCurrentBeat = async (ctx, next) => ctx.scene.enter(sceneNames.BEAT_DELETION_SCENE);

const createNewBeat = async (ctx, next) => ctx.scene.enter(sceneNames.CREATE_NEW_BEAT_SCENE);

module.exports = {
    controlButtons,
    getBeatById,
    editBeatMenu,
    editBeat,
    backFromEditingToBeat,
    deleteCurrentBeat,
    listenToCurrentBeat,
    createNewBeat
}
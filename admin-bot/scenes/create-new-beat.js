const WizardScene = require('telegraf/scenes/wizard');
const FormData = require('form-data');
const { Markup } = require('telegraf');
const Composer = require('telegraf/composer');

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { streamToFile } = require('../util/fs-async');
const { checkImage, checkAudio, getAudioExtension, getImageExtension } = require('../util/mime-type');
const hears = require('../hears');
const sceneNames = require('../constants/wizard-scenes-constants');
const BeatstoreService = require('../services/beatstore-service');

const beatstoreService = new BeatstoreService();

const phrases = [
  '📋 Enter title: ',
  '🎹 Enter bpm: ',
  '🎵 Enter scale: ',
  '🏷️ Enter tags: ',
  '🪕 Enter genres: ',
  '🎨 Enter moods: ',
  '🖼️ Send image: ',
  '🎧 Send preview audio: ',
  '💽 Enter mp3 url: ',
  '💽 Enter wav url: ',
  '💽 Enter stems url: '
];

const sendCurrentBeatState = async (beat, ctx, cursor) => {
  const caption =
    `📋 <b>${beat?.title || 'Empty'}</b>\n\n` +
    `🎹 <b>BPM:</b> ${beat?.bpm || 'Empty'}\n` +
    `🎵 <b>Scale:</b> ${beat?.scale || 'Empty'}\n` +
    `🏷️ <b>Tags:</b> ${
      beat?.tags
        ?.replace(/\\s/g, '')
        .split(',')
        .map((t) => `#${t}`)
        .join(' ') || 'Empty'
    }\n` +
    `🪕 <b>Genres:</b> ${
      beat?.genres
        ?.replace(/\\s/g, '')
        .split(',')
        .map((t) => `#${t}`)
        .join(' ') || 'Empty'
    }\n` +
    `🎨 <b>Moods:</b> ${
      beat?.moods
        ?.replace(/\\s/g, '')
        .split(',')
        .map((t) => `#${t}`)
        .join(' ') || 'Empty'
    }\n` +
    `🖼️ <b>Image:</b> ${beat?.imgUrl ? '<b>Specified</b>' : 'Empty'}\n` +
    `🎧 <b>Preview Audio:</b> ${beat?.previewAudioUrl ? '<b>Specified</b>' : 'Empty'}\n` +
    `💽 <b>MP3 Url:</b> <a href="${`${process.env.currentIP}api/${beat?.mp3Url}`.replace(/\\/g, '/') || 'Empty'}">link</a>\n` +
    `💽 <b>Wav Url</b> <a href="${`${process.env.currentIP}api/${beat?.wavUrl}`.replace(/\\/g, '/') || 'Empty'}">link</a>\n` +
    `💽 <b>STEMS Url:</b> <a href="${
      `${process.env.currentIP}api/${beat?.stemsUrl}`.replace(/\\/g, '/') || 'Empty'
    }">link</a>\n\n\n` +
    `${phrases[cursor] || ''}`;

  let messageId;
  if (beat?.imgUrl) {
    const { message_id } = await ctx.replyWithPhoto(
      { source: fs.createReadStream(beat.imgUrl) },
      {
        caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[Markup.callbackButton('🚫 Cancel', 'cancel')], [Markup.callbackButton('🌀 Listen', 'listen')]]
        }
      }
    );
    messageId = message_id;
  } else {
    const { message_id } = await ctx.reply(caption, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[Markup.callbackButton('🚫 Cancel', 'cancel')], [Markup.callbackButton('🌀 Listen', 'listen')]]
      }
    });
    messageId = message_id;
  }

  try {
    await ctx.deleteMessage(ctx.wizard.state.messageId);
  } catch (e) {
    // console.log(e.message);
  }
  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  } catch (e) {
    // console.log(e.message);
  }
  console.log(cursor);
  ctx.wizard.state.messageId = messageId;
};

const createNewBeatScene = new WizardScene(
  sceneNames.CREATE_NEW_BEAT_SCENE,
  async (ctx) => {
    await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
    return await ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      console.log(ctx?.message?.text);
      await ctx.reply('📋 Enter valid title!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.title = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Invalid bpm!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.bpm = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Invalid scale!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.scale = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Invalid tags!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.tags = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Invalid genres!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.genres = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Invalid moods!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.moods = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx.message.photo && !checkImage(ctx.message?.document?.mime_type)) {
      await ctx.reply('❗ Send valid image please!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      let fileId;
      let mimeType;
      if (ctx.message.photo) {
        fileId = ctx.message.photo[2].file_id;
        mimeType = 'image/jpeg';
      } else {
        fileId = ctx.message.document.file_id;
        mimeType = ctx.message.document.mime_type;
      }

      const fileLink = await ctx.telegram.getFileLink(fileId);
      const fileStream = await axios.get(fileLink, {
        responseType: 'stream'
      });
      const filePath = path.join(__dirname, '../temp-data', 'covers', `new-img.${getImageExtension(mimeType)}`);

      await streamToFile(fileStream.data, filePath);

      ctx.wizard.state.imgUrl = filePath;

      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.audio && !checkAudio(ctx?.message?.audio?.mime_type)) {
      await ctx.reply('❗ Send valid audio please!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      const fileId = ctx.message.audio.file_id;
      const mimeType = ctx.message.audio.mime_type;

      let fileLink;
      let fileStream;
      try {
        fileLink = await ctx.telegram.getFileLink(fileId);
        fileStream = await axios.get(fileLink, {
          responseType: 'stream'
        });
      } catch (e) {
        console.log(e.message);
        await ctx.reply(e.message);
        return await ctx.scene.leave();
      }

      const filePath = path.join(__dirname, '../temp-data', 'beats', `new-previewAudio.${getAudioExtension(mimeType)}`);

      await streamToFile(fileStream.data, filePath);

      ctx.wizard.state.previewAudioUrl = filePath;

      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Send valid mp3 url please!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.mp3Url = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Send valid wav url please!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.wavUrl = ctx.message.text;
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor);
      return ctx.wizard.next();
    }
  },
  async (ctx) => {
    if (!ctx?.message?.text) {
      await ctx.reply('❗ Send valid stems url please!');
      await sendCurrentBeatState(ctx.wizard.state, ctx, ctx.wizard.cursor - 1);
    } else {
      ctx.wizard.state.stemsUrl = ctx.message.text;

      await ctx.reply('❓ Are you sure you want to add new beat?\n\n', {
        reply_markup: {
          inline_keyboard: [[Markup.callbackButton('🤝 Yes', 'yes'), Markup.callbackButton('🛑 No', 'no')]]
        }
      });
    }
  }
);

createNewBeatScene.action('cancel', async (ctx, next) => {
  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  } catch (e) {
    // no-op
  }

  await ctx.reply('❕ Beat creation has been canceled!');
  await hears.allBeatsMenu(ctx, next);
  return await ctx.scene.leave();
});

createNewBeatScene.action('yes', async (ctx, next) => {
  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  } catch (e) {
    // no-op
  }

  const formData = new FormData();

  formData.append('title', ctx.wizard.state.title);
  formData.append('bpm', ctx.wizard.state.bpm);
  formData.append('scale', ctx.wizard.state.scale);
  formData.append('tags', ctx.wizard.state.tags);
  formData.append('genres', ctx.wizard.state.genres);
  formData.append('moods', ctx.wizard.state.moods);
  formData.append('cover', fs.createReadStream(ctx.wizard.state.imgUrl));
  formData.append('previewAudio', fs.createReadStream(ctx.wizard.state.previewAudioUrl));
  formData.append('mp3Url', ctx.wizard.state.mp3Url);
  formData.append('wavUrl', ctx.wizard.state.wavUrl);
  formData.append('stemsUrl', ctx.wizard.state.stemsUrl);

  try {
    const res = await beatstoreService.createNewBeat(formData, formData.getHeaders());
  } catch (e) {
    await ctx.reply(e.message);
    console.log(e.message);
    return await ctx.scene.leave();
  }

  const unlink = promisify(fs.unlink);

  try {
    await unlink(ctx.wizard.state.previewAudioUrl);
    await unlink(ctx.wizard.state.imgUrl);
  } catch (e) {
    console.log(e.message, 'from deleting file');
    await ctx.reply(e.message);
  }

  await ctx.reply('✅ New beat has been successfully added!');
  await hears.allBeatsMenu(ctx, next);

  return await ctx.scene.leave();
});

createNewBeatScene.action('no', async (ctx, next) => {
  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
  } catch (e) {
    // no-op
  }

  await ctx.reply('❕ Beat creation has been canceled!');
  await hears.allBeatsMenu(ctx, next);
  return await ctx.scene.leave();
});

createNewBeatScene.action('listen', async (ctx, next) => {
  console.log(ctx.wizard.state.previewAudioUrl);
  if (ctx.wizard.state.previewAudioUrl) {
    await ctx.replyWithAudio({ source: fs.createReadStream(ctx.wizard.state.previewAudioUrl) });
  } else {
    await ctx.reply('⚠ No audio specified yet!');
    await ctx.answerCbQuery();
  }
});

module.exports = {
  createNewBeatScene
};

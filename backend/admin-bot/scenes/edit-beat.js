const WizardScene = require('telegraf/scenes/wizard');
const sceneNames = require('../constants/wizard-scenes-constants');
const actions = require('../actions');
const BeatstoreService = require('../services/beatstore-service.js');
const beatstoreService = new BeatstoreService();
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const {promisify} = require('util');
const {streamToFile} = require('../util/fs-async');
const {checkAudio, checkImage, getAudioExtension, getImageExtension} = require('../util/mime-type');


const sendChangeMessage = async (ctx, text) => {
    await ctx.reply(text,
        {
            reply_markup: {
                force_reply: true
            },
            parse_mode: 'HTML'
        },
    );
}

const editTitleScene = new WizardScene(sceneNames.EDIT_BEAT_TITLE_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '📋 <b> Enter new title for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid title!');
            await sendChangeMessage(ctx, '📋 <b> Enter new title for the beat: </b>')
        } else {
            try {
                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    title: ctx.message.text
                });
            } catch (e) {
                await ctx.reply(e.response.data);
                return await ctx.scene.leave();
            }

            await ctx.reply('📋 <b> Title has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editBPMScene = new WizardScene(sceneNames.EDIT_BEAT_BPM_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🎹 <b> Enter new BPM for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid BPM!');
            await sendChangeMessage(ctx, '🎹 <b> Enter new BPM for the beat: </b>')
        } else {
            try {
                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    bpm: ctx.message.text
                });
            } catch (e) {
                await ctx.reply(e.response.data);
                return await ctx.scene.leave();
            }

            await ctx.reply('🎹 <b> BPM has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }
    }
)

const editScaleScene = new WizardScene(sceneNames.EDIT_BEAT_SCALE_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🎵 <b> Enter new scale for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid scale!');
            await sendChangeMessage(ctx, '🎵 <b> Enter new scale for the beat: </b>')
        } else {
            try {
                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    scale: ctx.message.text
                });
            } catch (e) {
                await ctx.reply(e.response.data);
                return await ctx.scene.leave();
            }
            await ctx.reply('🎵 <b> Scale has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editTagsScene = new WizardScene(sceneNames.EDIT_BEAT_TAGS_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🏷️ <b> Enter new tags for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter valid tags!');
            await sendChangeMessage(ctx, '🏷️ <b> Enter new tags for the beat: </b>')
        } else {
            try {
                const tags = ctx.message.text.split(',');

                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    tags
                });
            } catch (e) {
                await ctx.reply(e.response.data);
                return await ctx.scene.leave();
            }
            await ctx.reply('🏷️ <b> Tags has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editImageScene = new WizardScene(sceneNames.EDIT_BEAT_IMG_URL_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🖼️ <b> Send new image for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.photo && !checkImage(ctx.message?.document?.mime_type)) {
            await ctx.reply('❗ Please, send a valid image!');
            await sendChangeMessage(ctx, '🖼️ <b> Send new image for the beat: </b>')
        } else {
            const bodyFormData = new FormData();

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
                responseType: "stream"
            });
            const filePath = path.join(__dirname, '../temp-data', 'covers', `img.${getImageExtension(mimeType)}`);

            await streamToFile(fileStream.data, filePath);

            bodyFormData.append('cover', fs.createReadStream(filePath));

            try {
                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, bodyFormData, {
                    headers: bodyFormData.getHeaders()
                });
            } catch (e) {
                console.log(e.response.data.message);
                await ctx.reply(e.message);
                return await ctx.scene.leave();
            }

            const unlink = promisify(fs.unlink);

            try {
                await unlink(filePath);
            } catch (e) {
                console.log(e.message);
            }

            await ctx.reply('🖼️ <b> Image has been successfully changed!</b>',
                {
                    parse_mode: 'HTML'
                },
            );
            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editPreviewAudioScene = new WizardScene(sceneNames.EDIT_BEAT_PREVIEW_AUDIO_URL_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🎧 <b> Send new preview audio for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {

        if (!ctx?.message?.audio && !checkAudio(ctx?.message?.audio?.mime_type)) {
            await ctx.reply('❗ Please, send a valid preview audio!');
            await sendChangeMessage(ctx, '🎧 <b> Send new preview audio for the beat: </b>')
        } else {
            const bodyFormData = new FormData();

            const fileId = ctx.message.audio.file_id;
            const mimeType = ctx.message.audio.mime_type;

            let fileLink;
            let fileStream;
            try {
                fileLink = await ctx.telegram.getFileLink(fileId);
                fileStream = await axios.get(fileLink, {
                    responseType: "stream"
                });
            } catch (e) {
                console.log(e.message);
                await ctx.reply(e.message);
                return await ctx.scene.leave();
            }

            console.log(fileLink);

            const filePath = path.join(__dirname, '../temp-data', 'beats', `previewAudio.${getAudioExtension(mimeType)}`);

            await streamToFile(fileStream.data, filePath);

            bodyFormData.append('previewAudio', fs.createReadStream(filePath));

            try {
                await beatstoreService.updateBeatById(ctx.session.currentBeat.id, bodyFormData, {
                    headers: bodyFormData.getHeaders()
                });
            } catch (e) {
                console.log(e.response.data.message);
                await ctx.reply(e.message);
                return await ctx.scene.leave();
            }
            console.log('uploaded');
            const unlink = promisify(fs.unlink);

            try {
                await unlink(filePath);
            } catch (e) {
                console.log(e.message + 'from edit beat unlink');
                await ctx.reply(e.message);
            }

            await ctx.reply('🎧 <b> Preview audio has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();

        }

    }
)
const editMP3UrlScene = new WizardScene(sceneNames.EDIT_BEAT_MP3_URL_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '💽 <b> Enter new MP3 url for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid MP3 Url!');
            await sendChangeMessage(ctx, '💽 <b> Enter new MP3 Url for the beat: </b>')
        } else {

            try {
                await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    mp3Url: ctx.message.text
                });
            }
            catch (e) {
                console.log(e.response.data.message);
                await ctx.reply(e.message);
                return await ctx.scene.leave();
            }

            await ctx.reply('💽 <b> MP3 Url has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editWavUrlScene = new WizardScene(sceneNames.EDIT_BEAT_WAV_URL_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '💽 <b> Enter new WAV url for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid WAV Url!');
            await sendChangeMessage(ctx, '💽 <b> Enter new WAV Url for the beat: </b>')
        } else {
            try {
                await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    wavUrl: ctx.message.text
                });
            }
            catch (e) {
                console.log(e.response.data.message);
                await ctx.reply(e.message);
                return await ctx.scene.leave();
            }


            await ctx.reply('💽 <b> WAV Url has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editSTEMSUrlScene = new WizardScene(sceneNames.EDIT_BEAT_STEMS_URL_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '💽 <b> Enter new STEMS Url for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid title!');
            await sendChangeMessage(ctx, '💽 <b> Enter new STEMS Url for the beat: </b>')
        } else {
            try {
                await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    stemsUrl: ctx.message.text
                });
            }
            catch (e) {
                console.log(e.response.data.message);
                await ctx.reply(e.message);
                return await ctx.scene.leave();
            }

            await ctx.reply('💽 <b> STEMS url has been successfully changed </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editGenresScene = new WizardScene(sceneNames.EDIT_BEAT_GENRES_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🪕 <b> Enter new genres for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid genres!');
            await sendChangeMessage(ctx, '🪕 <b> Enter new genres for the beat: </b>')
        } else {

            try {
                const genres = ctx.message.text.split(',');

                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    genres
                });
            } catch (e) {
                await ctx.reply(e.response.data);
                return await ctx.scene.leave();
            }

            await ctx.reply('🪕 <b> Genres have been successfully changed! </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

const editMoodsScene = new WizardScene(sceneNames.EDIT_BEAT_MOODS_SCENE,
    async ctx => {
        await sendChangeMessage(ctx, '🎨 <b> Enter new moods for the beat: </b>')
        ctx.wizard.state.message_id = ctx.callbackQuery.message.message_id;
        return await ctx.wizard.next();
    },
    async (ctx, next) => {
        if (!ctx.message.text) {
            await ctx.reply('❗ Please, enter a valid moods!');
            await sendChangeMessage(ctx, '🎨 <b> Enter new moods for the beat: </b>')
        } else {
            try {
                const moods = ctx.message.text.split(',');

                const response = await beatstoreService.updateBeatById(ctx.session.currentBeat.id, {
                    moods
                });
            } catch (e) {
                await ctx.reply(e.response.data);
                return await ctx.scene.leave();
            }

            await ctx.reply('🎨 <b> Moods have been successfully changed! </b>',
                {
                    parse_mode: 'HTML'
                },
            );

            await actions.getBeatById(ctx, next);
            await ctx.deleteMessage(ctx.wizard.state.message_id);
            return await ctx.scene.leave();
        }

    }
)

module.exports = {
    editTitleScene,
    editBPMScene,
    editImageScene,
    editMP3UrlScene,
    editPreviewAudioScene,
    editScaleScene,
    editWavUrlScene,
    editSTEMSUrlScene,
    editTagsScene,
    editGenresScene,
    editMoodsScene
}
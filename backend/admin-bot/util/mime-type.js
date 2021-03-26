const IMAGE_MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const AUDIO_MIME_TYPE_MAP = {
    'audio/mpeg': 'mp3'
};

const checkAudio = (mimeType) => !!IMAGE_MIME_TYPE_MAP[mimeType];

const checkImage = (mimeType) => !!AUDIO_MIME_TYPE_MAP[mimeType];

const getImageExtension = (mimeType) => IMAGE_MIME_TYPE_MAP[mimeType];

const getAudioExtension = (mimeType) => AUDIO_MIME_TYPE_MAP[mimeType];

module.exports = {
    checkAudio,
    checkImage,
    getAudioExtension,
    getImageExtension
}
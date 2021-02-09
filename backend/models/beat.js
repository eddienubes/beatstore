const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const beatSchema = new Schema({
    title: {type: String, required: true},
    imgUrl: {type: String, required: true},
    previewAudioUrl: {type: String, required: true},
    mp3Url: {type: String, required: true},
    wavUrl: {type: String, required: true},
    stemsUrl: {type: String, required: true},
    bpm: {type: Number, required: true},
    duration: {type: String, required: true},
    scale: {type: String, required: true},
    loadTime: {type: Date, required: true},
    tags: {type: Array, required: true}
});

module.exports = mongoose.model('Beat', beatSchema);

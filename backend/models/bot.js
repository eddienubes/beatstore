const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    token: {type: String, required: true},
    botId: {type: String, required: true},
    date: {type: Date, required: true},
    isVerified: {type: Boolean, require: true}
});

module.exports = mongoose.model('Bot', botSchema);
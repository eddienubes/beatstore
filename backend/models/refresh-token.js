const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    refreshToken: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    expirationDate: {type: Date, required: true}
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
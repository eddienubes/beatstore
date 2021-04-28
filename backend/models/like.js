const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    commentId: {type: mongoose.Types.ObjectId, ref: 'Comment', required: true},
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Like', likeSchema);
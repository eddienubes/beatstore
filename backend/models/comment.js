const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, minlength: 1 },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  beatId: { type: mongoose.Types.ObjectId, ref: 'Beat', required: true },
  date: { type: Date, required: true },
  likesCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Comment', commentSchema);

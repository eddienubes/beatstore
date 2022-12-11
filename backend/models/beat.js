const mongoose = require('mongoose');

const { Schema } = mongoose;

const beatSchema = new Schema({
  title: { type: String, required: true },
  imgUrl: { type: String, required: true },
  previewAudioUrl: { type: String, required: true },
  mp3Url: { type: String, required: true },
  wavUrl: { type: String, required: true },
  stemsUrl: { type: String, required: true },
  duration: { type: String, required: true },
  scale: { type: String, required: true },
  loadTime: { type: Date, required: true },
  bpm: { type: String, required: true },
  moods: { type: [String], required: true },
  genres: { type: [String], required: true },
  tags: { type: [String], required: true }
});

beatSchema.index({
  title: 'text',
  scale: 'text',
  bpm: 'text',
  moods: 'text',
  genres: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Beat', beatSchema);

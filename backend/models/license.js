const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  type: { type: Number, required: true },
  price: { type: Number, required: true },
  label: { type: String, required: true }
});

module.exports = mongoose.model('License', licenseSchema);

const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    type: {type: Number, required: true},
    amount: {type: Number, required: true},
    label: {type: String, required: true}
});

module.exports = mongoose.model('Price', priceSchema);
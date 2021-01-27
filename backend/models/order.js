const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: {type: String, require: true},
    products: {type: [{type: mongoose.Types.ObjectId, ref: 'Beat'}], required: true},
    date: {type: Date, required: true},
    total: {type: Number, required: true}
});

module.exports = mongoose.model('Order', orderSchema);
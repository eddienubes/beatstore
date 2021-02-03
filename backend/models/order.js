const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    beatId: {type: mongoose.Types.ObjectId, ref: 'Beat', required: true},
    licenseId: {type: mongoose.Types.ObjectId, ref: 'License', required: true},
});

const orderSchema = new mongoose.Schema({
    customerId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    email: {type: String, required: true},
    products: {
        type: [
            {
                beatId: {type: mongoose.Types.ObjectId, ref: 'Beat', required: true},
                licenseId: {type: mongoose.Types.ObjectId, ref: 'License', required: true},
                _id: false
            }
        ],
        required: true
    },
    date: {type: Date, required: true},
    total: {type: Number, required: true}
});

module.exports = mongoose.model('Order', orderSchema);
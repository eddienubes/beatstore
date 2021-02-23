const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {type: String, default: null, minlength: 1},
    email: {type: String, required: true, unique: true},
    password: {type: String, minlength: 6, default: null},
    cart: {
        type: [
            {
                type: mongoose.Types.ObjectId, ref: 'Beat'
            }
        ],
        default: []
    },
    purchased: {
        type: [
            {
                type: mongoose.Types.ObjectId, ref: 'Order'
            }
        ],
        default: []
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
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
                type: mongoose.Types.ObjectId, ref: 'Beat'
            }
        ],
        default: []
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: { type: String, default: null, minlength: 1 },
  email: { type: String, required: true, unique: true },
  password: { type: String, minlength: 6, default: null },
  cart: {
    items: {
      type: [
        {
          beatId: { type: mongoose.Types.ObjectId, ref: 'Beat', required: true },
          licenseId: { type: mongoose.Types.ObjectId, ref: 'License', required: true }
        }
      ],
      default: []
    },
    total: { type: Number, default: 0 }
  },
  purchased: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Order'
      }
    ],
    default: []
  },
  status: {
    type: String,
    enum: ['Pending', 'Active'],
    default: 'Pending'
  },
  confirmationCode: {
    type: String,
    unique: false,
    required: false
  },
  isAdmin: { type: Boolean, default: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

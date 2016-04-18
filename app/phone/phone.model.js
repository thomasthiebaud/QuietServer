'use strict';

const mongoose = require('../../app/utils/database').mongoose;

const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
  userId: String,
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return (/^\+(?:[0-9] ?){6,14}[0-9]$/).test(v);
      },
      message: '{VALUE} is not a valid phone number!',
    },
    require: true,
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
  },
  ad: {
    type: Number,
    default: 0,
    min: 0,
  },
  scam: {
    type: Number,
    default: 0,
    min: 0,
  },
});

module.exports = mongoose.model('Phone', PhoneSchema);

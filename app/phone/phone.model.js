'use strict';

const checker = require('../utils/checker');
const mongoose = require('../../app/utils/database').mongoose;

const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
  userId: String,
  number: {
    type: String,
    validate: {
      validator(phone) {
        return checker.isPhone(phone);
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

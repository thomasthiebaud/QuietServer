'use strict';

const mongoose = require('../../app/utils/database').mongoose;

const Schema = mongoose.Schema;

const PhoneSchema = new Schema({
  userId: String,
  number: String,
  score: {type: Number, default: 0},
  ad: {type: Number, default: 0},
  scam: {type: Number, default: 0},
});

module.exports = mongoose.model('Phone', PhoneSchema);

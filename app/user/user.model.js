'use strict';

const mongoose = require('../../app/utils/database').mongoose;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  authProvider: {type: 'String', enum: ['GOO']},
  authId: String,
  email: String,
  isVerified: Boolean,
  name: String,
  locale: String,
});

module.exports = mongoose.model('User', UserSchema);

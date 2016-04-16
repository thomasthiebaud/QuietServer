'use strict';

const rootDir = require('app-root-path');
const mongoose = require(`${rootDir}/app/utils/database`).mongoose;
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

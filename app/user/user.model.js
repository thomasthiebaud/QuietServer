'use strict';

const checker = require('../utils/checker');
const mongoose = require('../../app/utils/database').mongoose;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  authProvider: {
    type: 'String',
    enum: ['GOO'],
  },
  authId: String,
  email: {
    type:String,
    validate: {
      validator: function(v) {
        return checker.isMail(v);
      },
      message: '{VALUE} is not a valid email!',
    },
    required: true,
  },
  isVerified: Boolean,
  name: String,
  locale: String,
});

module.exports = mongoose.model('User', UserSchema);

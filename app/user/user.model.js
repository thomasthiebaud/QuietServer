'use strict';

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
        return(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(v);
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

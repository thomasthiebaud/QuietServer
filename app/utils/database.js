'use strict';

const config = require('config');
const mongoose = require('mongoose');

const log = require('./logger').log;
const dbUri = config.get('mongo.uri');

mongoose.connect(dbUri);

mongoose.connection.on('connected', () => {
  log.info(`Mongoose default connection open to ${dbUri}`);
});

mongoose.connection.on('error', err => {
  log.error(`Mongoose default connection error ${err}`);
});

mongoose.connection.on('disconnected', () => {
  log.info('Mongoose default connection disconnected');
});

module.exports = {
  mongoose,
};

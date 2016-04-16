'use strict';

const config = require('config');
const mongoose = require('mongoose');
const rootDir = require('app-root-path');

const log = require(`${rootDir}/app/utils/logger`).log;
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

'use strict';

const bunyan = require('bunyan');
const config = require('../../config/config');

const log = bunyan.createLogger({
  name: 'quiet',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'error',
      path: config.logs.path,
    },
  ],
});

module.exports = {
  log,
};

'use strict';

const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'quiet',
  streams: [
    {
      level: 'info',
      stream: process.stdout,
    },
    {
      level: 'error',
      path: '/var/tmp/quiet-error.log',
    },
  ],
});

const auditLog = bunyan.createLogger({
  name: 'quietaudit',
  streams: [
    {
      level: 'info',
      path: '/var/tmp/quiet-audit.log',
    },
  ],
});

module.exports = {
  log,
  auditLog,
};

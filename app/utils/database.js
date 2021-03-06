'use strict';

const code = require('../../app/utils/code');
const config = require('../../config/config');
const log = require('./logger').log;
const mongoose = require('mongoose');

const Promise = require('bluebird');

function connect(_dbUri) {
  let dbUri;

  if (_dbUri) {
    dbUri = _dbUri;
  } else {
    dbUri = config.mongo.uri;
  }

  return new Promise((resolve, reject) => {
    if (mongoose.connection.readyState === 1) {
      resolve({
        code: code.S_DATABASE_CONNECTION_RETRIEVED,
        content: mongoose,
      });
    }

    mongoose.connect(dbUri, err => {
      if (err) {
        log.error(err, 'Error on database connection');

        reject({
          code: code.E_DATABASE,
        });
      } else {
        log.info('Successfully connected to database');
        resolve({
          code: code.S_DATABASE_CONNECTED,
          content: mongoose,
        });
      }
    });
  });
}

module.exports = {
  connect,
  mongoose,
};

'use strict';

const code = require('../../app/utils/code');
const config = require('config');
const log = require('./logger').log;
const mongoose = require('mongoose');

function connect(_dbUri) {
  let dbUri;

  if(_dbUri)
    dbUri = _dbUri;
  else
    dbUri = config.get('mongo.uri');

  return new Promise((resolve, reject) => {
    if(mongoose.connection.readyState === 1)
      return resolve({
        code: code.S_DATABASE_CONNECTION_RETRIEVED,
        content: mongoose,
      });

    mongoose.connect(dbUri, err => {
      if(err) {
        log.error(`Error on database connection : ${err}`);
        reject({
          code: code.E_DATABASE,
        });
      }
      else {
        log.info('Successfully connected to database');
        resolve({
          code: code.S_DATABASE_CONNECTED,
          content: mongoose,
        });
      }
    });
  })
}

module.exports = {
  connect,
  mongoose,
};

'use strict';

const config = require('config');
const log = require('./logger').log;
const mongoose = require('mongoose');

function connect(_dbUri) {
  let dbUri;

  if(_dbUri)
    dbUri = _dbUri;
  else
    dbUri = config.get('mongo.uri')

  return new Promise((resolve, reject) => {
    if(mongoose.connection.readyState === 1)
      return resolve(mongoose);

    mongoose.connect(dbUri, err => {
      if(err) {
        log.error(`Error on database connection : ${err}`);
        reject('Error on database connection');
      }
      else {
        log.info('Successfully connected to database');
        resolve(mongoose);
      }
    });
  })
}

module.exports = {
  connect,
  mongoose,
};

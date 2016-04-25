'use strict';

module.exports = {
  mongo: {
    uri: process.env.QUIET_MONGO_URI || 'mongodb://localhost:27017/Quiet',
  },
  server: {
    port: process.env.QUIET_SERVER_PORT || 8080,
  },
};

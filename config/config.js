'use strict';

const DEFAULT_QUIET_SERVER_PORT = 8080;

module.exports = {
  mongo: {
    uri: `mongodb://${process.env.QUIET_MONGO_URI || 'localhost'}:27017/Quiet`,
  },
  server: {
    port: process.env.QUIET_SERVER_PORT || DEFAULT_QUIET_SERVER_PORT,
    key: process.env.QUIET_SERVER_KEY || './config/quiet-test-key.pem',
    cert: process.env.QUIET_SERVER_CERT || './config/quiet-test-cert.pem',
    auth: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || 'clientId',
    },
  },
  logs: {
    path: '/var/tmp/quiet-error.log',
  },
};

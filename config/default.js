'use strict';

module.exports = {
  mongo: {
    uri: `mongodb://${process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost'}:27017/Quiet`,
  },
};

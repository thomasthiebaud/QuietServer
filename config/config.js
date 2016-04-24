'use strict';

module.exports = {
    mongo: {
        uri: process.env.QUIET_MONGO_URI || 'mongodb://localhost:27017/Quiet',
    },
};
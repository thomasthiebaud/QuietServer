'use strict';

const checker = require('./app/utils/checker');
const config = require('./config/config');
const database = require('./app/utils/database');
const express = require('express');
const expressValidator = require('express-validator');
const fs = require('fs');
const https = require('https');
const log = require('./app/utils/logger').log;
const bodyParser = require('body-parser');

const app = express();
const cert = fs.readFileSync(config.server.cert); // eslint-disable-line no-sync
const key = fs.readFileSync(config.server.key);   // eslint-disable-line no-sync


database.connect().then(() => {
  const phoneRoutes = require('./app/phone/phone.route'); // eslint-disable-line global-require
  const userRoutes = require('./app/user/user.route');    // eslint-disable-line global-require

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator({
    customValidators: {
      isPhone(phone) {
        return checker.isPhone(phone);
      },
      isMail(mail) {
        return checker.isMail(mail);
      },
    },
  }));

  app.use('/api', phoneRoutes);
  app.use('/api', userRoutes);

  https.createServer({
    key,
    cert,
  }, app).listen(config.server.port);
}).catch(err => {
  log.error(err);
  process.exit(1);
});

module.exports = app;

'use strict';

const checker = require('./app/utils/checker');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const log = require('./app/utils/logger').log;
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const database = require('./app/utils/database');

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
  app.listen(port);
}).catch(err => log.error(err));

module.exports = app;

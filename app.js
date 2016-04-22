'use strict';

const checker = require('./app/utils/checker');
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

const database = require('./app/utils/database');

database.connect().then(mongoose => {
  const phoneRoutes = require('./app/phone/phone.route');
  const userRoutes = require('./app/user/user.route');

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(expressValidator({
    customValidators: {
      isPhone: function(phone) {
        return checker.isPhone(phone);
      },
      isMail: function(mail) {
        return checker.isMail(mail);
      }
    }
  }));

  app.use('/api', phoneRoutes);
  app.use('/api', userRoutes);
  app.listen(port);
}).catch(err => {
  console.log(err)
});

module.exports = app;

'use strict';

const checker = require('../utils/checker');
const express = require('express');
const response = require('../utils/response');
const router = new express.Router();

const phoneController = require('./phone.controller.js');
const userController = require('../user/user.controller.js');

router.route('/phone').put((req, res) => {
  const schema = {
    idToken: {
      in: 'body',
      notEmpty: true
    },
    number: {
      in: 'body',
      notEmpty: true,
      isPhone: true
    },
    ad: {
      in: 'body',
      notEmpty: true,
      isBoolean: true
    },
    scam: {
      in: 'body',
      notEmpty: true,
      isBoolean: true
    }
  };

  checker.check(req, schema)
    .then(() => userController.logIn(req.body.idToken))
    .then(user => phoneController.report({userId: user.id, phoneNumber: req.body.number, ad: Boolean(req.body.ad), scam: Boolean(req.body.scam)}))
    .then(phone => response.send(res, phone.code))
    .catch(err => response.send(res, err.code));
});

router.route('/phone/:number').get((req, res) => {
  const schema = {
    number: {
      in: 'params',
      notEmpty: true,
      isPhone: true
    },
  };

  checker.check(req, schema)
    .then(() => userController.logIn(req.headers.idtoken))
    .then(() => phoneController.find(req.params.number))
    .then(phone => response.send(res, phone.code))
    .catch(err => response.send(res, err.code));
});

module.exports = router;

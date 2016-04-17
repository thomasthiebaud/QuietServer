'use strict';

const express = require('express');
const response = require('../utils/response');
const router = new express.Router();

const phoneController = require('./phone.controller.js');
const userController = require('../user/user.controller.js');

// TODO Check parameters before use

router.route('/phone').put((req, res) => {
  userController.logIn(req.body.idToken)
    .then(user => phoneController.report({userId: user.id, phoneNumber: req.body.number, ad: req.body.ad, scam: req.body.scam}))
    .then(phone => response.send(res, phone.code))
    .catch(err => response.send(res, err.code));
});

router.route('/phone/:number').get((req, res) => {
  userController.logIn(req.headers.idtoken)
    .then(() => phoneController.find(req.params.number))
    .then(phone => response.send(res, phone.code))
    .catch(err => response.send(res, err.code));
});

module.exports = router;

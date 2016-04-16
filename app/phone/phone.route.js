'use strict';

const express = require('express');
const router = new express.Router();
const rootDir = require('app-root-path');

const phoneController = require('./phone.controller.js');
const userController = require('../user/user.controller.js');
const log = require(`${rootDir}/app/utils/logger`).log;

// TODO Check parameters before use

router.route('/phone').put((req, res) => {
  userController.logIn(req.body.idToken)
    .then(user => phoneController.report(user.id, req.body.number, req.body.ad, req.body.scam))
    .then(phone => res.json({message: 'Phone created'}))
    .catch(err => res.json(err));
});

router.route('/phone/:number').get((req, res) => {
  userController.logIn(req.headers.idtoken)
    .then(user => phoneController.find(req.params.number))
    .then(phone => res.json(phone))
    .catch(err => res.json(err))
});

module.exports = router;

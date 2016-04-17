'use strict';

const express = require('express');
const response = require('../../app/utils/response');
const router = new express.Router();

const userController = require('./user.controller.js');

router.route('/user/signin/:authProvider').put((req, res) => {
  userController.signIn(req.body.idToken)
    .then(data => response.send(res, data.code))
    .catch(err => response.send(res, err.code));
});

module.exports = router;

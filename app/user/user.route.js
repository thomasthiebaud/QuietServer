'use strict';

const checker = require('../utils/checker');
const express = require('express');
const response = require('../../app/utils/response');
const router = new express.Router();

const userController = require('./user.controller.js');

router.route('/user/signin').put((req, res) => {
  const schema = {
    idToken: {
      in: 'body',
      notEmpty: true,
    },
  };

  checker.check(req, schema)
    .then(() => userController.signIn(req.body.idToken))
    .then(data => response.send(res, data.code))
    .catch(err => response.send(res, err.code));
});

module.exports = router;

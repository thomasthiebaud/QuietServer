'use strict';

const express = require('express');
const router = new express.Router();

const userController = require('./user.controller.js');

router.route('/user/auth/google').put((req, res) => {
  userController.signIn(req.body.idToken).then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;

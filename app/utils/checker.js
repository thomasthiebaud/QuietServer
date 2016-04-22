'use strict';

const code = require('../utils/code');

function check(req, schema) {
  return new Promise((resolve, reject) => {
    req.check(schema);
    req.asyncValidationErrors()
      .then(() => resolve())
      .catch(err => reject({
        code: code.E_INVALID_PARAM,
        message: `Invalid param : ${err[0].value}`,
      }))
  });
}

function isPhone(phone) {
  return (/^\+?[1-9]\d{5,14}$/).test(phone);
}

function isMail(mail) {
  return (/^[^@\s]+@[^@\s]+\.[^@\s]+$/).test(mail);
}

module.exports = {
  check,
  isPhone,
  isMail,
};
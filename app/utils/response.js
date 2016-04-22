'use strict';

const code = require('../utils/code');

function getMessage(_code) {
  switch (_code) {
    case code.S_PHONE_CREATED:
    case code.S_PHONE_REPORTED:
      return 'Phone reported';
    case code.S_USER_CREATED:
      return 'User created';
    case code.S_PHONE_FOUND:
      return 'Phone found';
    case code.S_USER_FOUND:
      return 'User found';
    case code.E_UNKNOWN_USER:
      return 'Unknown user';
    case code.E_DATABASE:
      return 'Internal server error';
    case code.E_INCORRECT_TOKEN:
      return 'Access denied';
    case code.E_INVALID_PARAM:
      return 'Invalid param';
    default:
      return '';
  }
}

function getHttpStatus(_code) {
  switch (_code) {
    case code.S_PHONE_CREATED:
    case code.S_PHONE_REPORTED:
    case code.S_USER_CREATED:
      return 201;
    case code.S_USER_FOUND:
    case code.S_PHONE_FOUND:
      return 200;
    case code.E_INVALID_PARAM:
    case code.E_UNKNOWN_USER:
      return 400;
    case code.E_DATABASE:
      return 500;
    case code.E_INCORRECT_TOKEN:
      return 403;
    default:
      throw new Error(`Unknown status code : ${_code}`);
  }
}

function send(res, _code, content) {
  const message = getMessage(_code);
  const httpMessage = {message};
  const httpStatus = getHttpStatus(_code);

  if (content) {
    httpMessage.content = content;
  }

  res
    .status(httpStatus)
    .json(httpMessage);
}

module.exports = {
  send,
};

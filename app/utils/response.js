'use strict';

const code = require('../utils/code');

function getMessage(_code) {
  switch (_code) {
    case code.S_CREATED:
    case code.S_REPORTED:
      return 'Phone reported';
    case code.S_FOUND:
      return 'Phone found';
    case code.E_UNKNOWN_USER:
      return 'Unknown user';
    case code.E_DATABASE:
      return 'Internal server error';
    case code.E_INCORRECT_TOKEN:
      return 'Access denied';
    default:
      throw new Error(`Unknown status code : ${_code}`);
  }
}

function getHttpStatus(_code) {
  switch (_code) {
    case code.S_CREATED:
    case code.S_REPORTED:
      return 201;
    case code.S_FOUND:
      return 200;
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
  const httpMessage = {message: message};
  const httpStatus = getHttpStatus(_code);

  if (content)
    httpMessage.content = content;

  res
    .status(httpStatus)
    .json(httpMessage);
}

module.exports = {
  send,
};

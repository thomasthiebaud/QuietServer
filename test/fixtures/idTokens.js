'use strict';

const newUser = {
  'iss': 'accounts.google.com',
  'aud': 'clientId',
  'sub': '12345678901234567890',
  'email': 'test@test.com',
  'iat': '0',
  'exp': '0',
  'name': 'testname',
  'email_verified': true,
  'locale': 'fr',
};

const existingUser = {
  'iss': 'accounts.google.com',
  'aud': 'clientId',
  'sub': '9876543210',
  'email': 'test@test.fr',
  'iat': '0',
  'exp': '0',
  'name': 'French test',
  'email_verified': true,
  'locale': 'fr',
};

const invalidEmailUser = {
  'iss': 'accounts.google.com',
  'aud': 'clientId',
  'sub': '12345678901234567890',
  'email': 'invalidMailAddress',
  'iat': '0',
  'exp': '0',
  'name': 'testname',
  'email_verified': true,
  'locale': 'fr',
};

const corruptedTokenInfo = {
  'iss': 'accounts.google.com',
  'aud': 'clientId',
  'sub': undefined,
  'email': 'invalidTestMail',
  'iat': '0',
  'exp': '0',
  'name': 'French test',
  'email_verified': true,
  'locale': 'fr',
};

module.exports = {
  newUser,
  existingUser,
  invalidEmailUser,
  corruptedTokenInfo,
};

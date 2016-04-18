'use strict';

const code = require('../utils/code');
const uuid = require('node-uuid');
const verifier = require('google-id-token-verifier');

const Promise = require('bluebird');
const User = require('./user.model');

function verifyGoogleIdToken(idToken) {
  return new Promise((resolve, reject) => {
    verifier.verify(idToken, process.env.GOOGLE_CLIENT_ID, (err, tokenInfo) => {
      if (err) {
        return reject({
          code: code.E_INCORRECT_TOKEN,
        });
      }

      return resolve({
        code: code.S_TOKEN_VALIDATED,
        content: tokenInfo,
      });
    });
  });
}

function checkUserExist(id) {
  return new Promise((resolve, reject) => {
    User.findOne({authId: id, authProvider: 'GOO'}, (err, user) => {
      if (!id || err) {
        return reject({
          code: code.E_DATABASE,
        });
      } else if (user === null) {
        return reject({
          code: code.E_UNKNOWN_USER,
        });
      }

      return resolve({
        code: code.S_FOUND,
        content: user,
      });
    });
  });
}

function addUserToDatabase(tokenInfo) {
  return new Promise((resolve, reject) => {
    const user = new User();

    user.id = uuid.v4();
    user.authId = tokenInfo.sub;
    user.authProvider = 'GOO';
    user.email = tokenInfo.email;
    user.isVerified = tokenInfo.email_verified;
    user.name = tokenInfo.name;
    user.locale = tokenInfo.locale;

    user.save(err => {
      if (err) {
        reject({
          code: code.E_DATABASE,
        });
      } else {
        resolve({
          code: code.S_CREATED,
          content: user,
        });
      }
    });
  });
}

function saveGoogleUser(tokenInfo) {
  return new Promise((resolve, reject) => {
    checkUserExist(tokenInfo.sub)
      .then(user => resolve(user))
      .catch(err => {
        if (err.code === code.E_UNKNOWN_USER) {
          return addUserToDatabase(tokenInfo)
            .then(user => resolve(user))
            .catch(err => reject(err));
        }

        return reject(err);
      });
  });
}

function signIn(idToken) {
  return new Promise((resolve, reject) => {
    verifyGoogleIdToken(idToken)
      .then(tokenInfoMessage => saveGoogleUser(tokenInfoMessage.content))
      .then(user => resolve(user))
      .catch(err => reject(err));
  });
}

function logIn(idToken) {
  return new Promise((resolve, reject) => {
    verifyGoogleIdToken(idToken)
      .then(tokenInfoMessage => checkUserExist(tokenInfoMessage.content.sub))
      .then(user => resolve(user))
      .catch(err => reject(err));
  });
}

module.exports = {
  signIn,
  logIn,
};

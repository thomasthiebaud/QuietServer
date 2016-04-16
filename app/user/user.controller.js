'use strict';

const uuid = require('node-uuid');
const verifier = require('google-id-token-verifier');

const Promise = require('bluebird');
const User = require('./user.model');

function verifyGoogleIdToken(idToken) {
  return new Promise((resolve, reject) => {
    verifier.verify(idToken, process.env.GOOGLE_CLIENT_ID, (err, tokenInfo) => {
      if (err) {
        return reject({
          message: 'Incorrect token',
          content: err,
        });
      }

      return resolve(tokenInfo);
    });
  });
}

function checkGoogleId(id) {
  return new Promise((resolve, reject) => {
    User.findOne({authId: id.sub, authProvider: 'GOO'}, (err, user) => {
      if (err) {
        return reject({
          message: 'An error occured when trying to request the database',
          content: err,
        });
      } else if (user === null) {
        return reject({
          message: 'Unknown user',
        });
      }

      return resolve(user);
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
          message: 'An error occured when trying to save the user into the database',
          content: err,
        });
      } else {
        resolve({
          message: 'User successfully created',
          content: user,
        });
      }
    });
  });
}

function saveGoogleUser(tokenInfo) {
  return new Promise((resolve, reject) => {
    checkGoogleId(tokenInfo.sub)
      .then(user => resolve(user))
      .catch(err => {
        if (err.message === 'Unknown user')
          return addUserToDatabase(tokenInfo).then(user => resolve(user)).catch(err => reject(err));

        return reject(err);
      });
  });
}

function signIn(idToken) {
  return new Promise((resolve, reject) => {
    verifyGoogleIdToken(idToken)
      .then(tokenInfo => saveGoogleUser(tokenInfo))
      .then(user => resolve(user))
      .catch(err => reject(err));
  });
}

function logIn(idToken) {
  return new Promise((resolve, reject) => {
    verifyGoogleIdToken(idToken)
      .then(tokenInfo => checkGoogleId(tokenInfo))
      .then(user => resolve(user))
      .catch(err => reject(err));
  })
}

module.exports = {
  signIn,
  logIn,
};

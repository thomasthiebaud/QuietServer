'use strict';

const crypto = require('crypto');
const fs = require('fs');
const request = require('request');
const rootDir = require('app-root-path');
const sinon = require('sinon');
const testEnvelope = require('../fixtures/envelope');
const testTokens = require('../fixtures/idTokens');
const testOAuthCerts = require('../fixtures/oauthcerts');

sinon
  .stub(request, 'get')
  .yields(null, {statusCode: 200, headers: {}}, testOAuthCerts);

function makeFakeIdToken(payload, envelope) {
  const privateKey = fs.readFileSync(`${rootDir}/test/fixtures/private.pem`, 'utf-8');
  const envelopeB64 = new Buffer(JSON.stringify(envelope)).toString('base64');
  const payloadB64 = new Buffer(JSON.stringify(payload)).toString('base64');
  let data;

  data = `${envelopeB64}.${payloadB64}`;

  const signer = crypto.createSign('sha256');

  signer.update(data);

  const signature = signer.sign(privateKey, 'base64');

  data += `.${signature}`;

  return data;
}

function makeValidPayload(payload) {
  const maxLifetimeSecs = 86400;
  const now = new Date().getTime() / 1000;
  const expiry = now + (maxLifetimeSecs / 2);

  payload.iat = now;
  payload.exp = expiry;

  return payload;
}

function generateIdToken(payload) {
  const envelope = Object.assign({}, testEnvelope);
  const idToken = makeFakeIdToken(payload, envelope);

  process.env.GOOGLE_CLIENT_ID = payload.aud;

  return idToken;
}

function generateNewUserToken() {
  const payload = makeValidPayload(testTokens.newUser);
  return generateIdToken(payload);
}

function generateExistingUserToken() {
  const payload = makeValidPayload(testTokens.existingUser);
  return generateIdToken(payload);
}

function generateInvalidMailToken() {
  const payload = makeValidPayload(testTokens.invalidEmailUser);
  return generateIdToken(payload);
}

function generateCorruptedTokenInfo() {
  const payload = makeValidPayload(testTokens.corruptedTokenInfo);
  return generateIdToken(payload);
}

module.exports = {
  generateNewUserToken,
  generateExistingUserToken,
  generateInvalidMailToken,
  generateCorruptedTokenInfo,
};

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;

const rootDir = require('app-root-path');
const userController = require(`${rootDir}/app/user/user.controller`);
const User = require(`${rootDir}/app/user/user.model`);
const log = require(`${rootDir}/app/utils/logger`).log;
const uuid = require('node-uuid');

const testEnvelope = require(`${rootDir}/test/fixtures/envelope`);
const testTokens = require(`${rootDir}/test/fixtures/idTokens`);
const testOAuthCerts = require(`${rootDir}/test/fixtures/oauthcerts`);

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

describe('Handle user authentification', function() {
  before(function(done) {
    sinon
      .stub(request, 'get')
      .yields(null, {statusCode: 200, headers: {}}, testOAuthCerts);
    done();
  });

  beforeEach(function(done) {
    process.env.GOOGLE_CLIENT_ID = '';
    const newUser = new User({
      id: uuid.v4(),
      authProvider: 'GOO',
      authId: '9876543210',
      email: 'test@test.fr',
      isVerified: true,
      name: 'French test',
      locale: 'fr',
    });

    newUser.save(function(err) {
      if (err)
        log.error(err);
      else
        done();
    });
  });

  after(function(done) {
    request.get.restore();
    done();
  });

  afterEach(function(done) {
    User.collection.drop();
    done();
  });

  it('should create an user if it does not exist yet and the idToken is valid', function(done) {
    const payload = makeValidPayload(testTokens.newUser);
    const envelope = Object.assign({}, testEnvelope);
    const data = makeFakeIdToken(payload, envelope);

    process.env.GOOGLE_CLIENT_ID = payload.aud;

    userController.signIn(data).then(res => {
      const user = res.content;

      expect(user.authId).to.be.equal('12345678901234567890');
      expect(user.authProvider).to.be.equal('GOO');
      expect(user.email).to.be.equal('test@test.com');
      expect(user.name).to.be.equal('testname');
      expect(user.locale).to.be.equal('fr');
      done();
    }).catch(err => {
      log.error(err);
    });
  });


  it('should return the corresponding user if it exists and the idToken is valid', function(done) {
    const payload = makeValidPayload(testTokens.existingUser);
    const envelope = Object.assign({}, testEnvelope);
    const data = makeFakeIdToken(payload, envelope);

    process.env.GOOGLE_CLIENT_ID = payload.aud;

    userController.signIn(data).then(res => {
      const user = res.content;
      
      expect(user.authId).to.be.equal('9876543210');
      expect(user.authProvider).to.be.equal('GOO');
      expect(user.email).to.be.equal('test@test.fr');
      expect(user.name).to.be.equal('French test');
      expect(user.locale).to.be.equal('fr');
      done();
    }).catch(err => log.error(err));
  });
});

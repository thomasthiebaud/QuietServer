'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../../app');
const Phone = require('../../app/phone/phone.model');
const User = require('../../app/user/user.model');
const rootDir = require('app-root-path');
const uuid = require('node-uuid');

chai.use(chaiHttp);

const crypto = require('crypto');
const fs = require('fs');
const sinon = require('sinon');
const request = require('request');

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

describe('Report a phone as an authenticated user', function() {
  let newUser;

  before(function(done) {
    sinon
      .stub(request, 'get')
      .yields(null, {statusCode: 200, headers: {}}, testOAuthCerts);

    newUser = new User({
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

  beforeEach(function(done) {
    process.env.GOOGLE_CLIENT_ID = '';

    const newPhone = new Phone({
      'userId': newUser.id,
      'number':'0123456789',
      'scam':false,
      'ad': true
    });
    newPhone.save(function(err) {
      if(err)
        log.error(err);
      else
        done();
    })
  });

  after(function(done) {
    request.get.restore();
    User.collection.drop();
    done();
  });

  afterEach(function(done) {
    Phone.collection.drop();
    done();
  });

  it('should create a phone on /phone PUT if it does not exist', function(done) {
    const payload = makeValidPayload(testTokens.existingUser);
    const envelope = Object.assign({}, testEnvelope);
    const idToken = makeFakeIdToken(payload, envelope);

    process.env.GOOGLE_CLIENT_ID = payload.aud;

    chai.request(app)
      .put('/api/phone')
      .send({'idToken': idToken, 'number':'0633878103','ad':true,'scam':true})
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.message).to.be.equal('Phone created');
        done();
        /*chai.request(app)
          .get('/api/phone/0633878103')
          .end(function(err, response) {
            const content = response.body.content;
            expect(content.number).to.be.equal('0633878103');
            expect(content.scam).to.be.equal(1);
            expect(content.ad).to.be.equal(1);
            expect(content.score).to.be.equal(2);
            done();
          })*/
      })
  });

  it('should return a phone on /phone GET', function(done) {
    const payload = makeValidPayload(testTokens.existingUser);
    const envelope = Object.assign({}, testEnvelope);
    const idToken = makeFakeIdToken(payload, envelope);

    process.env.GOOGLE_CLIENT_ID = payload.aud;

    chai.request(app)
      .get('/api/phone/0633878103')
      .set('idToken', idToken)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.message).to.be.equal('Phone successfully found');
        done();
      })
  });
});

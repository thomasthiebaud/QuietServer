'use strict';

const app = require('../../app');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const log = require('../../app/utils/logger').log;
const tokens = require('../utils/tokens');
const uuid = require('node-uuid');

const Phone = require('../../app/phone/phone.model');
const User = require('../../app/user/user.model');

chai.use(chaiHttp);

describe('Report a phone as an authenticated user', function() {
  let newUser;

  before(function(done) {
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
    const newPhone = new Phone({
      'userId': newUser.id,
      'number': '0123456789',
      'scam': false,
      'ad': true,
    });

    newPhone.save(function(err) {
      if (err)
        log.error(err);
      else
        done();
    });
  });

  after(function(done) {
    User.collection.drop();
    done();
  });

  afterEach(function(done) {
    Phone.collection.drop();
    done();
  });

  it('should report a phone on /phone PUT', function(done) {
    const idToken = tokens.generateIdToken(true);

    chai.request(app)
      .put('/api/phone')
      .send({idToken: idToken, number: '0633878103', ad: true, scam: true})
      .end(function(err, res) {
        expect(res).to.have.status(201);
        expect(res.body.message).to.be.equal('Phone reported');
        done();
      });
  });

  it('should return a phone on /phone GET', function(done) {
    const idToken = tokens.generateIdToken(true);

    chai.request(app)
      .get('/api/phone/0633878103')
      .set('idToken', idToken)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should fail to get a phone if idToken is not valid', function(done) {
    const idToken = 'Some invalid id token';

    chai.request(app)
      .get('/api/phone/0633878103')
      .set('idToken', idToken)
      .end(function(err, res) {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should fail to report a phone on /phone PUT', function(done) {
    const idToken = 'Some invalid id token';

    chai.request(app)
      .put('/api/phone')
      .send({idToken: idToken, number: '0633878103', ad: true, scam: true})
      .end(function(err, res) {
        expect(res).to.have.status(403);
        done();
      });
  });
});

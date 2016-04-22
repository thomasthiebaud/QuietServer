'use strict';

const app = require('../../app');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const log = require('../../app/utils/logger').log;
const tokensMock = require('../utils/tokens.mock');
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
      if (err) {
        log.error(err);
      } else {
        done();
      }
    });
  });

  beforeEach(function(done) {
    const newPhone = new Phone({
      userId: newUser.id,
      number: '+33123456789',
      scam: false,
      ad: true,
    });

    newPhone.save(function(err) {
      if (err) {
        log.error(err);
      } else {
        done();
      }
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

  describe('/phone PUT', function() {
    it('should successfully report a phone with valid params', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '+330633878103', ad: 'true', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(201);
          expect(res.body.message).to.be.equal('Phone reported');
          done();
        });
    });

    it('should fail to report a phone if the idToken is invalid', function(done) {
      const idToken = 'Some invalid id token';

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '+330633878103', ad: 'true', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(403);
          done();
        });
    });

    it('should fail to report a phone if idToken is empty', function(done) {
      chai.request(app)
        .put('/api/phone')
        .send({idToken: '', number: '+330633878103', ad: 'true', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });

    it('should fail to report a phone if the number is empty', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '', ad: 'true', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });

    it('should fail to report a phone if the number does not match E.164 numbering plan', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '0123456789', ad: 'true', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });

    it('should fail to report a phone if ad is empty', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '+330633878103', ad: '', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });

    it('should fail to report a phone if ad is not a boolean', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '+330633878103', ad: 'test', scam: 'true'})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });

    it('should fail to report a phone if scam is empty', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '+330633878103', ad: 'true', scam: ''})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });

    it('should fail to report a phone if scam is not a boolean', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .put('/api/phone')
        .send({idToken, number: '+330633878103', ad: 'true', scam: 'test'})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param');
          done();
        });
    });
  });

  describe('/phone GET', function() {
    it('should return a phone if it exists', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      chai.request(app)
        .get('/api/phone/+330633878103')
        .set('idToken', idToken)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should fail to get a phone if idToken is not valid', function(done) {
      const idToken = 'Some invalid id token';

      chai.request(app)
        .get('/api/phone/+330633878103')
        .set('idToken', idToken)
        .end(function(err, res) {
          expect(res).to.have.status(403);
          done();
        });
    });

    it('should fail to get a phone if the number does not match the E.164 numbering plan', function(done) {
      const idToken = 'Some invalid id token';

      chai.request(app)
        .get('/api/phone/0123456789')
        .set('idToken', idToken)
        .end(function(err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});

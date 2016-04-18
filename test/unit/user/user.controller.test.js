'use strict';

const code = require('../../../app/utils/code');
const chai = require('chai');
const expect = chai.expect;
const log = require('../../../app/utils/logger').log;
const tokens = require('../../utils/tokens');
const userController = require('../../../app/user/user.controller');
const uuid = require('node-uuid');

const User = require('../../../app/user/user.model');

describe('Handle user authentification', function() {
  beforeEach(function(done) {
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

  afterEach(function(done) {
    User.collection.drop();
    done();
  });

  it('should create an user if it does not exist yet and the idToken is valid', function(done) {
    const idToken = tokens.generateNewUserToken();

    userController.signIn(idToken).then(res => {
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
    const idToken = tokens.generateExistingUserToken();

    userController.signIn(idToken).then(res => {
      const user = res.content;

      expect(user.authId).to.be.equal('9876543210');
      expect(user.authProvider).to.be.equal('GOO');
      expect(user.email).to.be.equal('test@test.fr');
      expect(user.name).to.be.equal('French test');
      expect(user.locale).to.be.equal('fr');
      done();
    }).catch(err => log.error(err));
  });

  it('should fail to sign in if the email is incorrect', function(done) {
    const idToken = tokens.generateInvalidMailToken();

    userController.signIn(idToken).catch(err => {
      expect(err.code).to.be.equal(code.E_DATABASE);
      done();
    });
  });

  it('should fail to sign in if the sub field from token info is undefined', function(done) {
    const idToken = tokens.generateCorruptedTokenInfo();

    userController.signIn(idToken).catch(err => {
      expect(err.code).to.be.equal(code.E_DATABASE);
      done();
    });
  });
});

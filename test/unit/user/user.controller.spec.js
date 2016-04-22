const code = require('../../../app/utils/code');
const chai = require('chai');
const expect = chai.expect;
const log = require('../../../app/utils/logger').log;
const userController = require('../../../app/user/user.controller');
const uuid = require('node-uuid');
const tokensMock = require('../../utils/tokens.mock');

const User = require('../../../app/user/user.model');

describe('User controller', function() {
  before(function(done) {
    User.collection.drop();
    done();
  });

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
      if (err) {
        log.error(err);
      } else {
        done();
      }
    });
  });

  afterEach(function(done) {
    User.collection.drop();
    done();
  });

  describe('#signin', function() {
    it('should create an user if it does not exist yet and the idToken is valid', function(done) {
      const idToken = tokensMock.generateNewUserToken();

      userController.signIn(idToken).then(res => {
        expect(res.code).to.be.equal(code.S_USER_CREATED);

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
      const idToken = tokensMock.generateExistingUserToken();

      userController.signIn(idToken).then(res => {
        expect(res.code).to.be.equal(code.S_USER_FOUND);

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
      const idToken = tokensMock.generateInvalidMailToken();

      userController.signIn(idToken).catch(err => {
        expect(err.code).to.be.equal(code.E_DATABASE);
        done();
      });
    });

    it('should fail to sign in if the sub field from token info is undefined', function(done) {
      const idToken = tokensMock.generateCorruptedTokenInfo();

      userController.signIn(idToken).catch(err => {
        expect(err.code).to.be.equal(code.E_DATABASE);
        done();
      });
    });
  });

  describe('#login', function() {
    it('should log the user in if the idToken is valid', function(done) {
      const idToken = tokensMock.generateExistingUserToken();

      userController.signIn(idToken).then(res => {
        expect(res.code).to.be.equal(code.S_USER_FOUND);

        const user = res.content;

        expect(user.authId).to.be.equal('9876543210');
        expect(user.authProvider).to.be.equal('GOO');
        expect(user.email).to.be.equal('test@test.fr');
        expect(user.name).to.be.equal('French test');
        expect(user.locale).to.be.equal('fr');
        done();
      }).catch(err => log.error(err));
    });

    it('should fail to log the user in if he does not exist', function(done) {
      const idToken = tokensMock.generateNewUserToken();

      userController.logIn(idToken).catch(err => {
        expect(err.code).to.be.equal(code.E_UNKNOWN_USER);
        done();
      });
    });
  });
});

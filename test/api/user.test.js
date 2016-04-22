'use strict';

const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const tokensMock = require('../utils/tokens.mock');

const User = require('../../app/user/user.model');

chai.use(chaiHttp);

describe('Sign in', function() {
  beforeEach(function(done) {
    User.collection.drop();
    done();
  });

  describe('/user/signin PUT', function() {
    it('should create an user', function(done) {
      const idToken = tokensMock.generateNewUserToken();

      chai.request(app)
        .put('/api/user/signin')
        .send({idToken: idToken})
        .end(function(err, res) {
          expect(res).to.have.status(201);
          expect(res.body.message).to.be.equal('User created')
          done();
        });
    });

    it('should fail to create an user if the idToken is invalid', function(done) {
      const idToken = 'Some dummy token';

      chai.request(app)
        .put('/api/user/signin')
        .send({idToken: idToken})
        .end(function(err, res) {
          expect(res).to.have.status(403);
          expect(res.body.message).to.be.equal('Access denied')
          done();
        });
    });

    it('should fail to create an user if the idToken is empty', function(done) {
      chai.request(app)
        .put('/api/user/signin')
        .send({idToken: ''})
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body.message).to.be.equal('Invalid param')
          done();
        });
    });
  });
});

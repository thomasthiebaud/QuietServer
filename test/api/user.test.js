'use strict';

const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const tokens = require('../utils/tokens');

chai.use(chaiHttp);

describe('Sign in', function() {
  it('should create an user on /user/signin/google PUT', function(done) {
    const idToken = tokens.generateNewUserToken();

    chai.request(app)
      .put('/api/user/signin/google')
      .send({idToken: idToken})
      .end(function(err, res) {
        expect(res).to.have.status(201);
        done();
      });
  });

  it('should fail to create an user on /user/signin/google PUT if the idToken is invalid', function(done) {
    const idToken = 'Some dummy token';

    chai.request(app)
      .put('/api/user/signin/google')
      .send({idToken: idToken})
      .end(function(err, res) {
        expect(res).to.have.status(403);
        done();
      });
  });
});

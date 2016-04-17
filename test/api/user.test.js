'use strict';

const app = require('../../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const tokens = require('../utils/tokens');

chai.use(chaiHttp);

describe('Sign in', function() {
  it('should create an user on /user/signin/google PUT if it does not exist', function(done) {
    const idToken = tokens.generateIdToken();

    chai.request(app)
      .put('/api/user/signin/google')
      .send({idToken: idToken})
      .end(function(err, res) {
        expect(res).to.have.status(201);
        done();
      });
  });
});

const code = require('../../../app/utils/code');
const chai = require('chai');
const expect = chai.expect;

const response = require('../../../app/utils/response');
const ResponseMock = require('../../utils/response.mock');

describe('Response', function() {
  describe('#send', function() {
    it('should throw an exception with an unknown status', function(done) {
      const res = new ResponseMock();
      try {
        response.send(res, 0);
      } catch (err) {
        expect(err.message).to.be.equal('Unknown status code : 0');
        done();
      }
    });

    it('should match code S_PHONE_REPORTED', function(done) {
      const res = new ResponseMock();
      response.send(res, code.S_PHONE_REPORTED);
      expect(res.toString()).to.deep.equal({
        status: 201,
        body: {
          message: 'Phone reported',
        },
      });
      done();
    });

    it('should match code S_PHONE_CREATED', function(done) {
      const res = new ResponseMock();
      response.send(res, code.S_PHONE_CREATED);
      expect(res.toString()).to.deep.equal({
        status: 201,
        body: {
          message: 'Phone reported',
        },
      });
      done();
    });

    it('should match code S_PHONE_FOUND', function(done) {
      const res = new ResponseMock();
      response.send(res, code.S_PHONE_FOUND);
      expect(res.toString()).to.deep.equal({
        status: 200,
        body: {
          message: 'Phone found',
        },
      });
      done();
    });

    it('should match code S_USER_CREATED', function(done) {
      const res = new ResponseMock();
      response.send(res, code.S_USER_CREATED);
      expect(res.toString()).to.deep.equal({
        status: 201,
        body: {
          message: 'User created',
        },
      });
      done();
    });

    it('should match code S_USER_FOUND', function(done) {
      const res = new ResponseMock();
      response.send(res, code.S_USER_FOUND);
      expect(res.toString()).to.deep.equal({
        status: 200,
        body: {
          message: 'User found',
        },
      });
      done();
    });

    it('should match code E_UNKNOWN_USER', function(done) {
      const res = new ResponseMock();
      response.send(res, code.E_UNKNOWN_USER);
      expect(res.toString()).to.deep.equal({
        status: 404,
        body: {
          message: 'Unknown user',
        },
      });
      done();
    });

    it('should match code E_UNKNOWN_PHONE', function(done) {
      const res = new ResponseMock();
      response.send(res, code.E_UNKNOWN_PHONE);
      expect(res.toString()).to.deep.equal({
        status: 404,
        body: {
          message: 'Phone not found',
        },
      });
      done();
    });

    it('should match code E_DATABASE', function(done) {
      const res = new ResponseMock();
      response.send(res, code.E_DATABASE);
      expect(res.toString()).to.deep.equal({
        status: 500,
        body: {
          message: 'Internal server error',
        },
      });
      done();
    });

    it('should match code E_INCORRECT_TOKEN', function(done) {
      const res = new ResponseMock();
      response.send(res, code.E_INCORRECT_TOKEN);
      expect(res.toString()).to.deep.equal({
        status: 403,
        body: {
          message: 'Access denied',
        },
      });
      done();
    });

    it('should match code E_INVALID_PARAM', function(done) {
      const res = new ResponseMock();
      response.send(res, code.E_INVALID_PARAM);
      expect(res.toString()).to.deep.equal({
        status: 400,
        body: {
          message: 'Invalid param',
        },
      });
      done();
    });

    it('should match a code with a return content', function(done) {
      const res = new ResponseMock();
      const content = {test: 'Test'};
      response.send(res, code.S_PHONE_FOUND, content);
      expect(res.toString()).to.deep.equal({
        status: 200,
        body: {
          message: 'Phone found',
          content,
        },
      });
      done();
    });
  });
});

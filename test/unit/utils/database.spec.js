'use strict';

const code = require('../../../app/utils/code');
const chai = require('chai');
const expect = chai.expect;

const database = require('../../../app/utils/database');

describe('Database connection', function() {
  before(function(done) {
    database.mongoose.disconnect();
    done();
  });

  afterEach(function(done) {
    database.mongoose.disconnect();
    done();
  });

  it('should success to start the database with a correct env', function(done) {
    database.connect().then(mongooseMessage => {
      expect(mongooseMessage.code).to.be.equal(code.S_DATABASE_CONNECTED);
      done();
    });
  });

  it('should fail to start the database with an incorrect env', function(done) {
    database.connect('dummy').catch(err => {
      expect(err.code).to.be.equal(code.E_DATABASE);
      done();
    });
  });

  it('should return the opened connection if existing', function(done) {
    let firstMongooseInstance;
    database.connect()
      .then(mongooseMessage => {
        expect(mongooseMessage.code).to.be.equal(code.S_DATABASE_CONNECTED);
        firstMongooseInstance = mongooseMessage.content;
        return database.connect();
      })
      .then(mongooseMessage => {
        expect(mongooseMessage.code).to.be.equal(code.S_DATABASE_CONNECTION_RETRIEVED);
        expect(firstMongooseInstance).to.deep.equal(mongooseMessage.content);
        done();
      });
  });
});

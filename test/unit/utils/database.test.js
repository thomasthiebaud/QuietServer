'use strict';

const chai = require('chai');
const expect = chai.expect;
const log = require('../../../app/utils/logger').log;
const tokens = require('../../utils/tokens');

const database = require('../../../app/utils/database');

describe('Database connection', function() {
  afterEach(function(done) {
    database.mongoose.disconnect();
    done();
  });

  it('should success to start the database with a correct env', function(done) {
    database.connect().then(() => {
      done();
    });
  });
  
  it('should fail to start the database with incorrect env', function(done) {
    database.connect('dummy').catch(err => {
      done();
    });
  });

  it('should return the opened connection if existing', function(done) {
    let first;
    database.connect()
      .then(mongoose => {
        first = mongoose;
        return database.connect()
      })
      .then(mongoose => {
        expect(first).to.deep.equal(mongoose);
        done();
      });
  });
});

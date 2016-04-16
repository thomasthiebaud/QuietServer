'use strict';

const rootDir = require('app-root-path');
const chai = require('chai');
const expect = chai.expect;

const log = require(`${rootDir}/app/utils/logger`).log;
const phoneController = require(`${rootDir}/app/phone/phone.controller`);
const Phone = require(`${rootDir}/app/phone/phone.model`);

describe('Phone controller test case', function() {
  beforeEach(function(done) {
    const newPhone = new Phone({
      number: '0123456789',
      scam: false,
      ad: true,
      score: 1,
    });

    newPhone.save(function(err) {
      if (err)
        log.error(err);
      else
        done();
    });
  });

  afterEach(function(done) {
    Phone.collection.drop();
    done();
  });

  it('should find a phone given its number', function(done) {
    phoneController.find('0123456789').then(res => {
      expect(res.content.number).to.be.equal('0123456789');
      expect(res.content.scam).to.be.equal(0);
      expect(res.content.ad).to.be.equal(1);
      expect(res.content.score).to.be.equal(1);
      done();
    }).catch(function(err) {
      log.error(err);
    });
  });

  it('should create a phone given its number if it does not exist', function(done) {
    phoneController.report('dummyToken', '9876543210', true, true).then(res => {
      expect(res.message).to.be.equal('Phone successfully reported');
      expect(res.content.number).to.be.equal('9876543210');
      expect(res.content.scam).to.be.equal(1);
      expect(res.content.ad).to.be.equal(1);
      expect(res.content.score).to.be.equal(2);
      done();
    }).catch(err => {
      log.error(err);
    });
  });

  it('should update a phone given its number if it exists', function(done) {
    phoneController.report('dummyToken', '0123456789', true, true).then(res => {
      expect(res.message).to.be.equal('Phone successfully reported');
      expect(res.content.number).to.be.equal('0123456789');
      expect(res.content.scam).to.be.equal(1);
      expect(res.content.ad).to.be.equal(2);
      expect(res.content.score).to.be.equal(3);
      done();
    }).catch(err => {
      log.error(err);
    });
  });
});

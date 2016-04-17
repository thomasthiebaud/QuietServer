'use strict';

const chai = require('chai');
const code = require('../../../app/utils/code');
const expect = chai.expect;
const log = require('../../../app/utils/logger').log;
const phoneController = require('../../../app/phone/phone.controller');

const Phone = require('../../../app/phone/phone.model');

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
    phoneController.report({userId: 'dummyToken', phoneNumber: '9876543210', ad: true, scam: true}).then(res => {
      expect(res.code).to.be.equal(code.S_REPORTED);

      const content = res.content;

      expect(content.number).to.be.equal('9876543210');
      expect(content.scam).to.be.equal(1);
      expect(content.ad).to.be.equal(1);
      expect(content.score).to.be.equal(2);
      done();
    }).catch(err => {
      log.error(err);
    });
  });

  it('should update a phone given its number if it exists', function(done) {
    phoneController.report({userId: 'dummyToken', phoneNumber: '0123456789', ad: true, scam: true}).then(res => {
      expect(res.code).to.be.equal(code.S_REPORTED);

      const content = res.content;

      expect(content.number).to.be.equal('0123456789');
      expect(content.scam).to.be.equal(1);
      expect(content.ad).to.be.equal(2);
      expect(content.score).to.be.equal(3);
      done();
    }).catch(err => {
      log.error(err);
    });
  });
});

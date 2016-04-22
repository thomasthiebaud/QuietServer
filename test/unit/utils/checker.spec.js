const checker = require('../../../app/utils/checker');
const chai = require('chai');
const expect = chai.expect;

describe('Checker', function() {
  describe('#isPhone', function() {
    it('should fail to validate a number if it contains something else than + or digits', function(done) {
      const res = checker.isPhone('abcdef');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate a number with more than 15 digits', function(done) {
      const res = checker.isPhone('12345678901234567890');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate a number with less than 5 digits', function(done) {
      const res = checker.isPhone('12345');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate a number which contains whitespaces', function(done) {
      const res = checker.isPhone('1 2 3 4 5');
      expect(res).to.be.false;
      done();
    });

    it('should validate a number which begins with a +', function(done) {
      const res = checker.isPhone('+1234567890');
      expect(res).to.be.true;
      done();
    });

    it('should validate a number which begins with a +', function(done) {
      const res = checker.isPhone('+1234567890');
      expect(res).to.be.true;
      done();
    });
  });
  describe('#isMail', function() {
    it('should fail to validate an email if it has several @', function(done) {
      const res = checker.isMail('test@test@test@test.com');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate an email if it does not have a .', function(done) {
      const res = checker.isMail('test@test');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate an email if it does not have a character before the @', function(done) {
      const res = checker.isMail('@test.com');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate an email if it does not have a character before the .', function(done) {
      const res = checker.isMail('test@.com');
      expect(res).to.be.false;
      done();
    });

    it('should fail to validate an email if it does not have a character after the .', function(done) {
      const res = checker.isMail('test@test.');
      expect(res).to.be.false;
      done();
    });

    it('should validate a correct email', function(done) {
      const res = checker.isMail('test@test.com');
      expect(res).to.be.true;
      done();
    });
  });
});

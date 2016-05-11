'use strict';

const code = require('../utils/code');
const log = require('../utils/logger').log;

const Phone = require('./phone.model');

function savePhoneToDatabase(_report, _phone) {
  return new Promise((resolve, reject) => {
    const phone = new Phone();

    phone.userId = _report.userId;
    phone.number = _report.phoneNumber;
    if (_phone === null) {
      phone.ad = 0;
      phone.scam = 0;
      phone.score = 0;
    } else {
      phone.ad = _phone.ad;
      phone.scam = _phone.scam;
      phone.score = _phone.score;
    }

    phone.ad += _report.ad ? 1 : 0;
    phone.scam += _report.scam ? 1 : 0;
    phone.score = phone.ad + phone.scam;

    phone.save(err => {
      if (err) {
        log.error(err);
        reject({
          code: code.E_DATABASE,
        });
      } else {
        resolve({
          code: code.S_PHONE_REPORTED,
          content: {
            number: phone.number,
            ad: phone.ad,
            scam: phone.scam,
            score: phone.score,
          },
        });
      }
    });
  });
}

function find(_phoneNumber) {
  return new Promise((resolve, reject) => {
    Phone.findOne({number: _phoneNumber}, (err, phone) => {
      if (!_phoneNumber || err) {
        log.error(err);
        reject({
          code: code.E_DATABASE,
        });
      } else if (phone) {
        resolve({
          code: code.S_PHONE_FOUND,
          content: {
            number: phone.number,
            scam: phone.scam,
            ad: phone.ad,
            score: phone.score,
          },
        });
      } else {
        resolve({
          code: code.E_UNKNOWN_PHONE,
          content: null,
        });
      }
    });
  });
}

function report(_report) {
  return new Promise((resolve, reject) => {
    find(_report.phoneNumber)
      .then(phoneMessage => savePhoneToDatabase(_report, phoneMessage.content))
      .then(phoneMessage => resolve(phoneMessage))
      .catch(err => reject(err));
  });
}

module.exports = {
  find,
  report,
};

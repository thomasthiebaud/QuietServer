'use strict';

const code = require('../utils/code');

const Phone = require('./phone.model');
const Promise = require('bluebird');

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
        reject({
          code: code.E_DATABASE,
        });
      } else {
        resolve({
          code: code.S_REPORTED,
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
      if (err) {
        reject({
          code: code.E_DATABASE,
        });
      } else {
        resolve({
          code: code.S_FOUND,
          content: phone,
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

'use strict';

const code = require('../utils/code');

const Phone = require('./phone.model');
const Promise = require('bluebird');

function find(phoneNumber) {
  return new Promise((resolve, reject) => {
    Phone.findOne({number: phoneNumber}, (err, phone) => {
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

function report(report) {
  return new Promise((resolve, reject) => {
    Phone.findOne({number: report.phoneNumber}, (err, phone) => {
      let newPhone;

      if (err) {
        reject({
          code: code.E_DATABASE,
        });
      } else {
        if (phone === null) {
          newPhone = new Phone();
          newPhone.userId = report.userId;
          newPhone.number = report.phoneNumber;
          newPhone.ad = 0;
          newPhone.scam = 0;
          newPhone.score = 0;
        } else
          newPhone = phone;

        newPhone.ad += report.ad ? 1 : 0;
        newPhone.scam += report.scam ? 1 : 0;
        newPhone.score = newPhone.ad + newPhone.scam;
      }

      newPhone.save(err => {
        if (err) {
          reject({
            code: code.E_DATABASE,
          });
        } else {
          resolve({
            code: code.S_REPORTED,
            content: {
              number: newPhone.number,
              ad: newPhone.ad,
              scam: newPhone.scam,
              score: newPhone.score,
            },
          });
        }
      });
    });
  });
}

module.exports = {
  find,
  report,
};

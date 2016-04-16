'use strict';

const Phone = require('./phone.model');
const Promise = require('bluebird');

function find(phoneNumber) {
  return new Promise((resolve, reject) => {
    Phone.findOne({number: phoneNumber}, (err, phone) => {
      if (err) {
        reject({
          message: 'An error occured when trying to request the database',
          content: err,
        });
      } else {
        resolve({
          message: 'Phone successfully found',
          content: phone,
        });
      }
    });
  });
}

function report(userId, phoneNumber, adNumber, scamNumber) {
  return new Promise((resolve, reject) => {
    Phone.findOne({number: phoneNumber}, (err, phone) => {
      let newPhone;

      if (err) {
        reject({
          message: 'An error occured when trying to request the database',
          content: err,
        });
      } else {
        if (phone === null) {
          newPhone = new Phone();
          newPhone.userId = userId;
          newPhone.number = phoneNumber;
          newPhone.ad = 0;
          newPhone.scam = 0;
          newPhone.score = 0;
        } else
          newPhone = phone;

        newPhone.ad += adNumber ? 1 : 0;
        newPhone.scam += scamNumber ? 1 : 0;
        newPhone.score = newPhone.ad + newPhone.scam;
      }

      newPhone.save(err => {
        if (err) {
          reject({
            message: 'An error occured when trying to save the phone into the database',
            content: err,
          });
        } else {
          resolve({
            message: 'Phone successfully reported',
            content: newPhone,
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

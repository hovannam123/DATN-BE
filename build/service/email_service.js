"use strict";

var nodemailer = require("nodemailer");
var crypto = require('crypto');
var generateDigitCode = function generateDigitCode() {
  var digitCodeLength = 6;
  var chars = '0123456789';
  var code = '';
  for (var i = 0; i < digitCodeLength; i++) {
    var randomIndex = crypto.randomInt(chars.length);
    code += chars.charAt(randomIndex);
  }
  return code;
};
var sendMail = function sendMail(desEmail, generateDigitCode) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'namho100901@gmail.com',
      pass: 'nbkkijlnsxoakalb'
    }
  });
  var mailOptions = {
    from: 'namho100901@gmail.com',
    to: desEmail,
    subject: 'Verify Code',
    text: 'This is a code sent for you to verify: ' + generateDigitCode
  };
  return transporter.sendMail(mailOptions);
};
module.exports = {
  sendMail: sendMail,
  generateDigitCode: generateDigitCode
};
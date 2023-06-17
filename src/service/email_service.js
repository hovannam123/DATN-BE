const nodemailer = require("nodemailer");
const crypto = require('crypto');

let generateDigitCode = () => {
    const digitCodeLength = 6;
    const chars = '0123456789';
    let code = '';

    for (let i = 0; i < digitCodeLength; i++) {
        const randomIndex = crypto.randomInt(chars.length);
        code += chars.charAt(randomIndex);
    }

    return code;
}

let sendMail = (desEmail, generateDigitCode) => {
    console.log(desEmail)
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'namho100901@gmail.com',
            pass: 'nbkkijlnsxoakalb'
        }
    });

    let mailOptions = {
        from: 'namho100901@gmail.com',
        to: desEmail,
        subject: 'Verify Code',
        text: 'This is a code sent for you to verify: ' + generateDigitCode
    };

    return transporter.sendMail(mailOptions)
}


module.exports = {
    sendMail,
    generateDigitCode
}
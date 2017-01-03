const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

const transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
}));

const sendMail = (name, email, message, cb) => {
    debugger;
    const mailOptions = {
        from: '"Your beloved site" <noreply@boot.life>', // sender address
        to: process.env.OWNER, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: `${name} ${email} ${message}`, // plaintext body
    };

    return transporter.sendMail(mailOptions, cb);
}

module.exports = {
    sendMail
};
const nodemailer = require('nodemailer');
const config = require('../config.json');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const sendEmail = async (receiverEmail, subject = 'Beatstore mail', template, contextObject = {}) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: config.gmail,
        to: receiverEmail,
        subject: subject,
        template,
        context: contextObject
    }

    const hbsConfiguration = {
        viewEngine: {
            partialsDir: path.join(__dirname, '/../views/partials'),
            layoutsDir: path.join(__dirname, '/../views/layouts'),
            extname: '.hbs'
        },
        extName: '.hbs',
        viewPath: path.join(__dirname, '/../views')
    };
    
    transporter.use('compile', hbs(hbsConfiguration));

    await transporter.sendMail(mailOptions);
}

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.gmail,
            pass: config.gmailAppPass
        }
    });
}

module.exports = {
    sendEmail
};
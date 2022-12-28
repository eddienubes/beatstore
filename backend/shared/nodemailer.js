const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const { CONTENT } = require('./constants');

const sendEmail = async (receiverEmail, template, contextObject = {}, subject = 'Beatstore mail') => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.GMAIL,
    to: receiverEmail,
    subject,
    template,
    context: { producerName: CONTENT.PRODUCER_NAME, ...contextObject }
  };

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
};

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_APP_PASS
    }
  });

module.exports = {
  sendEmail
};

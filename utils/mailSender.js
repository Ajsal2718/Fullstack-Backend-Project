// const { config } = require('dotenv');
// const nodemailer = require('nodemailer')
// const configJs = require('../config/config')
// config()

// const mailSender = async (email, title, body) => {
//     try {
//       // Create a Transporter to send emails
//       let transporter = nodemailer.createTransport({
//         auth: {
//           user: process.env.MAIL_USER,
//           pass: process.env.MAIL_PASSWORD
//         }
//       });
//       // Send emails to users
//       let info = await transporter.sendMail({
//         from: 'muhammedajsal532@gmail.com',
//         to: email,
//         subject: title,
//         html: body,
//       });
//       console.log("Email info: ", info);
//       return info;
//     } catch (error) {
//       console.log(error.message);
//     }
//   };
  // module.exports = mailSender;
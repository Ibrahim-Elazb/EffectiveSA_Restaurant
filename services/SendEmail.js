// @ts-nocheck
const sgMail = require('@sendgrid/mail');
const HttpError = require('../util/HttpError');
// var nodeoutlook = require('nodejs-nodemailer-outlook');
// const sendEmail = (receiverEmail,subject,messageText) => {
//      nodeoutlook.sendEmail({
//         auth: {
//             user: process.env.OUTLOOK_EMAIL_ADDRESS,
//             pass: process.env.OUTLOOK_EMAIL_PASSWORD
//         },
//         from: process.env.OUTLOOK_EMAIL_ADDRESS,
//         to: receiverEmail,
//         subject,
//         // text: messageText,
//         html: messageText,
//         onError: (error) => {
//             console.log("Sending Mail Failed")
//             console.log("Error Details: ")
//             console.log(error)
//             throw new HttpError(500, "Sending Mail Failed")
//         },
//         onSuccess: (result) => {
//             console.log("Sending Mail Succeed")
//             // console.log("result is: ")
//             // console.log(result)
//         }
//     });
// }

const sendEmail = (receiverEmail, subject, messageText) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: receiverEmail,
        from: 'ibrahim.m.elazb@gmail.com', // Use the email address or domain you verified above
        subject: subject,
        //   text: messageText,
        html: messageText,
    };
    //ES6
    sgMail
        .send(msg)
        .then(() => {
            console.log("Sending Mail Successfully.")
        }, error => {
            console.log("Sending Mail Failed")
            console.log("Error Details: ")
            if (error.response) {
                console.error(error.response.body)
            }
            throw error;
        });
}

module.exports = sendEmail;
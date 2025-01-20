const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'email-smtp.eu-north-1.amazonaws.com',
    port: 587,
    secure: false,
    auth: {
        user: 'AKIAZQ3DTEXNDEG37UF3',  // SES SMTP user
        pass: 'BHdNdhRBfXKX7nbh+lfzgsQQcfAUFjGeSdd1tZcNnlX7'   // SES SMTP password
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'prathamesh.r.jaiswal@gmail.com',  // Verified SES sender email
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

module.exports = sendEmail;

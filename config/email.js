const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.HOST_EMAIL}`,
        pass: `${process.env.EMAIL_AUTH}`,
    }
});

const confirmationEmail = (username, id, email) => {
    return {
        from: `Derek Noble <${process.env.HOST_EMAIL}>`,
        to: `${email}`,
        subject: 'your Halen Email confirmation',
        //redo form as link with email validation id urlparam
        html: `<body>
            <h1>Hello, ${username}!</h1>
            <p>Welcome to the Halen technical assessment. Press to confirm your email account</p>
            <a href="${process.env.APPLICATION_URL}/auth/email/${id}/confirmation">Confirm</a>
        </body>`,
    };
};

module.exports = { mailTransporter, confirmationEmail };
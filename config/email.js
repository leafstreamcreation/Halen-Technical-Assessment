const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.HOST_EMAIL}`,
        pass: `${process.env.EMAIL_AUTH}`,
    }
});

const confirmationEmail = (username, email) => {
    return {
        from: `Derek Noble <${process.env.HOST_EMAIL}>`,
        to: `${email}`,
        subject: 'your Halen Email confirmation',
        html: `<body>
            <h1>Hello, ${username}!</h1>
            <p>Welcome to the Halen technical assessment. Press to confirm your email account</p>
            <form action=${process.env.APPLICATION_URL}/auth/validate/email method="post">
                <input type="text" name="username" value="${username}" hidden>
                <input type="submit" value="Confirm">
            </form>
        </body>`,
    };
};

module.exports = { mailTransporter, confirmationEmail };
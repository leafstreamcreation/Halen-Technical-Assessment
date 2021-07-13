const router = require("express").Router();

const mongoose = require("mongoose");
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const SESSION_EXPIRATION = 1000 * 60 * 30; //Sessions live for 30 minutes
const EmailValidation = require("../models/EmailValidation.model");
const PhoneValidation = require("../models/PhoneValidation.model");

const axios = require("axios");
const sms77Request = axios.create({
    baseURL: `https://gateway.sms77.io/api`,
    headers: {
      "Authorization": `basic ${process.env.SMS77_KEY}`,
    },
});

const { mailTransporter, confirmationEmail } = require("../config/email");


const bcrypt = require("bcryptjs");
const saltRounds = 10;


router.post("/signup", (req, res, next) => {
    const { username, password, email, phonenumber } = req.body;
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    
    if (!username || !password || !email || !phonenumber) {
      return res
        .status(400)
        .send("Please provide your username, password, email, and phone number");
    }
    else if (!passwordRegex.test(password)) {
        return res.status(400).send(
            "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter",
        );
    }
    else User.findOne({ username }).then((found) => {
        if (found) return res.status(400).send(`User "${username}" already exists`);
        else return bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
            return User.create({
                username,
                passhash: hashedPassword,
                email,
                phonenumber,
            });
        })
        .then((user) => {
            mailTransporter.sendMail(confirmationEmail(user.username, user.email))
            .then(_ => {
                console.log("Email sent");
                EmailValidation.create({user: user.username}).then(_ => console.log("Validation created"));
            });
            
            return res.status(201).json({ 
                userId: user._id, 
                username: user.username, 
                password: password, 
                email: user.email, 
                phonenumber: user.phonenumber
            });
        })
        .catch((error) => {
            if (error instanceof mongoose.Error.ValidationError) return res.status(400).send(`${error.message}`);
            else return res.status(500).send(`${error.message}`);
        });
    });
});

router.post("/login", (req, res, next) => {
    const { username, password } = req.body;
    if (!username) return res
        .status(400)
        .send("Please provide your username."); 
    else if (!password) return res
        .status(400)
        .send("Please provide your password");

    User.findOne({ username })
    .then((user) => {
        if (!user) return res.status(400).send(`User "${username}" not found`);
        else bcrypt.compare(password, user.passhash).then((isSamePassword) => {
            if (!isSamePassword) return res.status(400).send("Wrong password");
            else Session.create({ user: user._id, expires: new Date(Date.now() + SESSION_EXPIRATION) })
            .then( (session) => {
                console.log(session);
                return res.json({ token: session._id, expires: session.expires });
            });
        });
    })
    .catch((err) => {
        next(err);
    });
});


router.post("/sms", (req, res, next) => {
    sms77Request.post("/sms", {}, { params: {
        to: "13032632271",
        text: "I HAVE THE PANTS",
    }}).then(response => {
        console.log(response);
        res.status(200).json(response.data);
    }).catch(error => {
        console.log(error);
        res.status(200).json(error);
    });
});

router.post("/validate/email", async (req, res) => {
    const { username } = req.body;
    const pendingVerification = await EmailValidation.findOne({user: username}).exec();
    if (pendingVerification) EmailValidation.findByIdAndDelete(pendingVerification._id).then(finishedVerification => {
        res.status(200).send(`Thanks, ${finishedVerification.user}! Your email has been verified.`);
    }).catch(error => {
        res.status(500).send(`Unable to validate email for "${username}"`)
    })
    else res.status(400).send(`User "${username}" has no email pending verification.`);
});

router.post("/validate/phone", async (req, res) => {
    const { username, otpCode } = req.body;
    const pendingVerification = await PhoneValidation.findOne({user: username}).exec();
    if (pendingVerification) {
        if (pendingVerification.otpCode === otpCode) {
            PhoneValidation.findByIdAndDelete(pendingVerification._id).then(finishedVerification => {
                res.status(200).send(`Thanks, ${finishedVerification.user}! Your phone number has been verified.`);
            }).catch(error => {
                res.status(500).send(`Unable to validate phone number for "${username}"`)
            });
        }
        else res.status(400).send("Incorrect One Time Password submitted. Check for typos and try again.")
    }
    else res.status(400).send(`User "${username}" has no phone number pending verification.`);

});

module.exports = router;
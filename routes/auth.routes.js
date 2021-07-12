const router = require("express").Router();

const mongoose = require("mongoose");
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const EmailValidation = require("../models/EmailValidation.model");
const PhoneValidation = require("../models/PhoneValidation.model");

const axios = require("axios");
const sms77Request = axios.create({
    baseURL: `https://gateway.sms77.io/api`,
    headers: {
      "Authorization": `basic ${process.env.SMS77_KEY}`,
    },
  });


const bcrypt = require("bcryptjs");
const saltRounds = 10;


router.post("/signup", (req, res, next) => {
    res.status(200).send("Boop!");
});

router.post("/login", (req, res, next) => {

});


router.post("/sms", (req, res, next) => {
    sms77Request.post("/sms", {}, { params: {
        to: "13032632271",
        text: "I HAVE THE PANTS",
        from: "sms77.io",
    }}).then(response => {
        console.log(response)
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
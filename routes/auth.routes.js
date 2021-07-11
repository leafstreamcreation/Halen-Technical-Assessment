const router = require("express").Router();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const saltRounds = 10;

//put User, Session, PhoneValidation, and EmailValidation
const User = require("../models/User.model");
const Session = require("../models/Session.model");
const EmailValidation = require("../models/EmailValidation.model");
const PhoneValidation = require("../models/PhoneValidation.model");

router.post("/signup", (req, res, next) => {

});

router.post("/login", (req, res, next) => {

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

router.post("/validate/phone", (req, res) => {

});



// user phone confirmation ->
// 	takes username and otpCode (in request body)
// 	find uservalidation with username
// 	if otpcode match delete phonevalidation and return 200 w/ message: "your account is successfully confirmed"
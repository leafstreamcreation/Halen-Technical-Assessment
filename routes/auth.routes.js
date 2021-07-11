const router = require("express").Router();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const saltRounds = 10;

//put User, Session, PhoneValidation, and EmailValidation

router.post("/signup", (req, res, next) => {

});

router.post("/login", (req, res, next) => {

});

router.post("/validate/email", (req, res, next) => {

});

router.post("/validate/phone", (req, res, next) => {

});
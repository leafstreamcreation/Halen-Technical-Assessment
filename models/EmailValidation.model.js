const {Schema, model} = require("mongoose");

const emailValidationSchema = new Schema({
    user: { type: String, required: true, unique: true},
});

const EmailValidation = model("EmailValidation", emailValidationSchema);

module.exports = EmailValidation;
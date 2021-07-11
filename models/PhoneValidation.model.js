const {Schema, model} = require("mongoose");

const phoneValidationSchema = new Schema({
    user: { type: String, required: true, unique: true,},
    otpCode: { type: Number, required: true},
});

const PhoneValidation = model("PhoneValidation", phoneValidationSchema);

module.exports = PhoneValidation;
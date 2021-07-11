const {Schema, model} = require("mongoose");

const sessionSchema = new Schema({
    user: { type: String, required: true, unique: true},
});

const Session = model("Session", sessionSchema);

module.exports = Session;
const {Schema, model} = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const sessionSchema = new Schema({
    user: { type: ObjectId, ref: "User"},
    createdAt: {
      type: Date,
      default: Date.now(),
      index: { expires: 1000 * 60 * 30 }, // 30 minutes for session
    },
});

const Session = model("Session", sessionSchema);

module.exports = Session;
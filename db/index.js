const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/Halen-Technical-Assessment";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})
.then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
})
.catch(err => {
    console.error("Error connecting to Mongo: ", err);
})
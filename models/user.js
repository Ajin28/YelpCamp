const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")

// Schema setup
let userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

//Defining a model
module.exports = mongoose.model("User", userSchema);

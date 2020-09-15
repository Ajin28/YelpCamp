const mongoose = require("mongoose");

// Schema setup
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//Defining a model
module.exports = mongoose.model("Campground", campgroundSchema);

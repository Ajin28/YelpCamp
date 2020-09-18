const mongoose = require("mongoose");

// Schema setup
let commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//Defining a model
module.exports = mongoose.model("Comment", commentSchema);

const mongoose = require("mongoose");
const Comment = require('./comment');

// Schema setup
let campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

campgroundSchema.pre('remove', async function () {
    console.log(this.comments)
    await Comment.deleteMany({
        _id: {
            $in: this.comments
        }
    });
});


//Defining a model
module.exports = mongoose.model("Campground", campgroundSchema);

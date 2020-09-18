const express = require('express');
const router = express.Router({ mergeParams: true });
//this will merge the params from app.js url and here so we can access id
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const User = require('../models/user');


//NEW Comment
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground })
        }
    })
})

//CREATE Comment
router.post("/", function (req, res) {
    let comment = req.body.comment;
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            Comment.create(comment, function (err, savedComment) {
                if (err) {
                    console.log(err);
                } else {
                    savedComment.author.id = req.user._id;
                    savedComment.author.username = req.user.username;
                    savedComment.save();
                    campground.comments.push(savedComment)
                    campground.save();
                    //console.log(savedComment);
                    //console.log(req.user);
                    res.redirect("/campgrounds/" + req.params.id)

                }
            })
        }
    })
})

//middleware - to add a comment user must be looged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router
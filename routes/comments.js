const express = require('express');
const router = express.Router({ mergeParams: true });
//this will merge the params from app.js url and here so we can access id
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//NEW Comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

// EDIT comment
router.get("/:comment_id/edit", middleware.commentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment })
        }
    })
})

// UPDATE comment
router.put("/:comment_id", middleware.commentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// DELETE comment
router.delete("/:comment_id", middleware.commentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
            //res.redirect("back")
        } else {
            Campground.findById(req.params.id, function (err, campground) {
                campground.comments.pull(req.params.comment_id)//can also use .remove its an alias
                campground.save();
            })
            console.log("deletes")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})



module.exports = router
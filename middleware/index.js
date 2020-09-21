let middlewareObj = {}
const Campground = require("../models/campground");
const Comment = require("../models/comment");

middlewareObj.commentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found")
                console.log(err)
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Inside flash we pass in a key and a value and we do that before we redirect.
    // It's really important if I put this line after we redirect. It won't work.
    req.flash("error", "You need to be logged in to do that.")
    res.redirect("/login")
}

middlewareObj.campgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found")
                console.log(err)
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("back")
    }
}

module.exports = middlewareObj;
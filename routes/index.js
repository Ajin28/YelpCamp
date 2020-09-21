const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user")


// LANDING PAGE
router.get("/", (req, res) => {
    res.render("landing");
});

// SHOW REGISTER FORM
router.get("/register", (req, res) => {
    res.render("register");
})

//REGISTER USER
router.post("/register", (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message) //omit this
            //console.log(err);
            // Per the docs, you can either set a flash message on the req.flash object before returning a res.redirect() or you can pass the req.flash object into the res.render() function.
            return res.redirect("register") //or return res.render("register",{"error":err.message})
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds")
        })
    })

})

//SHOW LOGIN FORM
router.get("/login", (req, res) => {
    res.render("login");
});

//LOGIN USER
router.post("/login", passport.authenticate("local", {
    // successRedirect: "/campgrounds",
    // successFlash: "Welcome",
    failureFlash: true,
    failureRedirect: "/login"
}), function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.flash("success", "Welcome to YelpCamp, " + req.user.username);
    res.redirect("/campgrounds")

})

//LOGOUT USER
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Successfully Logged out")
    res.redirect("/campgrounds")
});

//middleware - to add a comment user must be looged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;
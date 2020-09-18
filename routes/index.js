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
router.post("/register", isLoggedIn, (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function () {
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
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {

})

//LOGOUT USER
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/")
});

//middleware - to add a comment user must be looged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;
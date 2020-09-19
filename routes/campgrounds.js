const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");


//INDEX
router.get("/", (req, res) => {

    //Retrieving Campgrounds from database
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", { campgrounds });
        }
    })

});

//CREATE
router.post("/", isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let campground = { name, image, description, author };
    //  Adding new campground to database
    Campground.create(campground, function (err, newCampground) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(campground)
            res.redirect("/campgrounds")
        }
    })

});

//NEW 
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground })
        }
    })
})

//EDIT 
router.get("/:id/edit", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", { campground: foundCampground })

        }
    })
})


//UPDATE
router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY
router.delete("/:id", function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            campground.remove().catch(err => { console.log(err) })
            res.redirect("/campgrounds")
        }
    })
})


//middleware - to add a campground user must be looged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router
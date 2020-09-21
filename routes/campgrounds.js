const express = require('express');
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

// index.js is a special name that if we require a directory but not a file if I just require middleware it will automatically
// require the contents of index Dot.

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
router.post("/", middleware.isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let campground = { name, image, description, price, author };
    //  Adding new campground to database
    Campground.create(campground, function (err, newCampground) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(campground)
            req.flash("success", "Successfully added Campground")
            res.redirect("/campgrounds")
        }
    })

});

//NEW 
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.get("/:id/edit", middleware.campgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground })
    })
})


//UPDATE
router.put("/:id", middleware.campgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            req.flash("success", "Successfully updated Campground")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY
router.delete("/:id", middleware.campgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            campground.remove().catch(err => { console.log(err) })
            req.flash("success", "Succesfully deleted Campground")
            res.redirect("/campgrounds")
        }
    })
})



module.exports = router
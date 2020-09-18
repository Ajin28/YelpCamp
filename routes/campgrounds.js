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
router.post("/", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let campground = { name, image, description };
    //  Adding new campground to database
    Campground.create(campground, function (err, newCampground) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds")
        }
    })

});

//NEW 
router.get("/new", (req, res) => {
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

module.exports = router
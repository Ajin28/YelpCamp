const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seed")

//Seeding the database
//seedDB();

//Connecting DB
mongoose.connect('mongodb://localhost:27017/YelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// //Adding campgrounds
// Campground.create(
//     {
//         name: "Lake Mantade",
//         image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description: "A beautiful lake surrounded by trees and native flora.Good place for bird watching and camping enthusiasts"
//     },

//     function (err, res) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(res);
//         }
//     }
// )


app.get("/", (req, res) => {
    res.render("landing");
});

//INDEX
app.get("/campgrounds", (req, res) => {
    //Retrieving Campgrounds from database
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { campgrounds });
        }
    })

});

//CREATE
app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

//SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campground: foundCampground })

        }
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log("YelpCamp Server has started");
});

//post(form) : req.body.paramName
//get(form)  :req.query.paramName
//get(<a>)   :req.param.paramName
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")
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
app.use(express.static(__dirname + "/public"))

//------ROUTES
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
            res.render("campgrounds/index", { campgrounds });
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
    res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground })
        }
    })
})

//NEW Comment
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground })
        }
    })
})

//CREATE Comment
app.post("/campgrounds/:id/comments", function (req, res) {
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
                    campground.comments.push(savedComment)
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id)

                }
            })
        }
    })
})


app.listen(process.env.PORT || 3000, () => {
    console.log("YelpCamp Server has started");
});

//post(form) : req.body.paramName
//get(form)  :req.query.paramName
//get(<a>)   :req.param.paramName
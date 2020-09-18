const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")
const User = require("./models/user")
const seedDB = require("./seed");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMondoose = require("passport-local-mongoose")

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

//-----PASSPORT CONFIGURATION
app.use(require("express-session")({
    //this secret is used to encode and decode sessions. It can be anything.
    secret: "maow is awesome",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// whatever we put in res.local is what's available inside of our template
app.use(function (req, res, next) {
    res.locals.currentUser = req.user
    next();
})

//------ROUTES

// LANDING PAGE
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
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
//-------AUTH ROUTES

// Show Register Form
app.get("/register", (req, res) => {
    res.render("register");
})

//REGISTER USER
app.post("/register", isLoggedIn, (req, res) => {
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
app.get("/login", (req, res) => {
    res.render("login");
});

//LOGIN USER
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {

})

//LOGOUT USER
app.get("/logout", function (req, res) {
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

app.listen(process.env.PORT || 3000, () => {
    console.log("YelpCamp Server has started");
});



//post(form) : req.body.paramName
//get(form)  :req.query.paramName
//get(<a>)   :req.param.paramName
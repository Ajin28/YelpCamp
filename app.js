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
const methodOverride = require("method-override");
const flash = require("connect-flash")
const fetch = require("node-fetch");

//ROUTES
const commentRoutes = require('./routes/comments');
const campgroundRoutes = require('./routes/campgrounds');
const indexRoutes = require("./routes/index")

//Seeding the database
//seedDB();

//Connecting DB
mongoose.connect(process.env.DB_LINK || 'mongodb://localhost:27017/YelpCamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
// app.use(function (req, res, next) {
//     res.locals.currentUser = req.user
//     res.locals.error = req.flash("error");
//     res.locals.success = req.flash("success")
//     next();
// })


app.use(async function (req, res, next) {
    try {
        let response = await fetch("https://generateaybottoken.azurewebsites.net/api/GenerateToken?code=a0NyNJETKtQZuxkDo1b8mRixsjVB2N4pJVtfUw4DdhmNvalBHmTRMg==");
        let token = await response.json();
        res.locals.token = token;
        res.locals.currentUser = req.user
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
    }
    catch (e) {
        //console.log(e);
        res.locals.token = null;
        res.locals.currentUser = req.user
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");
    }
    finally {
        next();
    }

})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3002, () => {
    console.log("YelpCamp Server has started");
});


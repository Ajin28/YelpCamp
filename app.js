const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

var campgrounds = [
    { name: "Lake Mantade", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Mounatain Creek", image: "https://images.unsplash.com/photo-1581205445756-15c1d2e9a8df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Kaheti Forest", image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Lake Mantade", image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Mounatain Creek", image: "https://images.unsplash.com/photo-1581205445756-15c1d2e9a8df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" },
    { name: "Kaheti Forest", image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" }
]

app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", { campgrounds });
});

app.post("/campgrounds", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let campground = { name, image };
    campgrounds.push(campground);
    res.redirect("/campgrounds")
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("YelpCamp Server has started");
});
const mongoose = require("mongoose");
const Campground = require("./models/campground")
const Comment = require("./models/comment");

let comment = {
    text: "This place is great, but i wish there was internet",
    author: "Kiwi"
}

var seeds = [
    {

        name: "Lake Mantade",
        image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "A beautiful lake surrounded by trees and native flora.Good place for bird watching and camping enthusiasts",

    },
    {

        name: "Mounatain Creek",
        image: "https://images.unsplash.com/photo-1581205445756-15c1d2e9a8df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Breathtaking mountain views. Great for Camping.",

    },
    {
        name: "Kaheti Forest",
        image: "https://images.unsplash.com/photo-1515408320194-59643816c5b2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Get back to nature in this mesmerizing tropical forest. Witness wildlife in its inate form and find your inate instincts"
    },
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupiseedst non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupiseedst non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupiseedst non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

//CALLBACK HELL
function seedDB() {
    Campground.deleteMany({}, function (err, emptyCampgrounds) {
        //First Callback : Removing all Campgrounds
        if (err) {
            console.log(err)
        }
        else {
            console.log(emptyCampgrounds);
            Comment.deleteMany({}, function (err, emptyComments) {
                //Second Callback: Removing all Comments
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(emptyComments);
                    seeds.forEach(function (seed) {
                        Campground.create(seed, function (err, campground) {
                            //Third Callback : Adding a Campground
                            if (err) {
                                console.log(err)
                            } else {
                                console.log("Campground created-----\n" + campground)
                                Comment.create(comment, function (err, comment) {
                                    // Fourth Callback : Adding comment on a Campground 
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        console.log("Comment created-----\n" + comment)
                                        campground.comments.push(comment);
                                        campground.save();
                                    }
                                })
                            }
                        })
                    })
                }
            })
        }
    });
}


//=======================================================Using Promises================================
function seedDBpromise() {
    Campground.deleteMany().exec()
        .then((emptyCampgrounds) => {
            console.log(emptyCampgrounds);
            return Comment.deleteMany().exec()
        })
        .then((emptyComments) => {
            console.log(emptyComments);

            for (const seed of seeds) {
                let addedCampground;
                Campground.create(seed).then((campground) => {
                    console.log("Campground created-----\n" + campground);
                    addedCampground = campground;
                    return Comment.create(comment)
                }).then((comment) => {
                    console.log("Comment created-----\n" + comment)
                    addedCampground.comments.push(comment);
                    return addedCampground.save()
                }).then((completeCampground) => {
                    console.log("Comment added to Campground-----\n" + completeCampground);
                }).catch(err => {
                    console.log(err);
                })
            }

        })
        .catch((err) => {
            console.log(err);
        })
}


//================================================================Using async/await===================================
async function seedDBaa() {
    try {
        let emptyCampgrounds = await Campground.deleteMany().exec();
        console.log(emptyCampgrounds);
        let emptyComments = await Comment.deleteMany().exec();
        console.log(emptyComments);

        // for (const seed of seeds) {
        //     let addedCampground = await Campground.create(seed);
        //     console.log("Campground created-----\n" + addedCampground);

        //     let addedComment = await Comment.create(comment);
        //     console.log("Comment created-----\n" + addedComment);

        //     addedCampground.comments.push(addedComment);
        //     let completeCampground = await addedCampground.save();
        //     console.log("Comment added to Campground------\n" + completeCampground);
        // }
        console.log("It worked!!!!!!!")
    }
    catch (err) {
        console.log(err);
    }

}



module.exports = seedDBaa;


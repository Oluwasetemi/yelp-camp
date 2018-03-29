var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//Schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String, 
  description: String
});

//Model
var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create({
//   name: "Salmon geek",
//   image: "https://farm4.staticflickr.com/3717/12822913975_18e8b3e69d.jpg",
//   description: 'It is a very wonderful place to visit, good toilet, network for internet: A safe haven'
// }, (err, campground) => {
//   if (err) {
//     console.log(err); 
//   } else {
//     console.log('New data campground inserted to db');
//     console.log(campground);
//   }
// });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log('err');
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  })
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.post("/campgrounds", (req, res) => {
  const { name, image, description } = req.body;
  // console.log(name, image);
  const newCampground = { name: name, image: image, description: description };
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("campgrounds");
    }
  })
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log('err'); 
    } else {
      res.render('show', {campground: foundCampground})
    }
  })
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

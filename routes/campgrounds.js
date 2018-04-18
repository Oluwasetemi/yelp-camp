var express = require('express')
var router = express.Router();

const Campground = require('../model/campground')


router.get("", (req, res) => {
  console.log(req.user)
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log('err');
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
    }
  })
});

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post("", (req, res) => {
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

router.get('/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log('err'); 
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
});

module.exports = router
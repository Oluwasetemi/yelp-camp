const express = require('express')
const router = express.Router();

const Campground = require('../models/campground')
const middleware = require('../middleware')


router.get("/", (req, res) => {
  // console.log(req.user)
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log('err');
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds,
        currentUser: req.user
      });
    }
  })
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  const { name, price, image, description } = req.body
  const { id, username } = req.user
  const author = {
    id,
    username
  }
  const newCampground = {
    name: name,
    image: image,
    price,
    description: description,
    author: author
  };
  // console.log(author);
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
      // console.log(foundCampground);
      res.render('campgrounds/show', {
        campground: foundCampground
      })
    }
  })
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', 
  middleware.checkCampgroundOwnerShip, 
  (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', {
      campground: foundCampground
    })
  })
})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnerShip, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

// TODO: DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnerShip, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})


module.exports = router
var express = require('express')
var router = express.Router();

const Campground = require('../model/campground')


router.get("/", (req, res) => {
  // console.log(req.user)
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log('err');
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
    }
  })
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn, (req, res) => {
  const { name, image, description } = req.body
  const {id, username} = req.user
  const author = {
    id,
    username
  }
  const newCampground = { name: name, image: image, description: description, author: author };
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
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
});

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if(err) {
      res.redirect('/campgrounds')
    } else {
      res.render('campgrounds/edit', { campground: foundCampground })
    }
  })
})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', (req, res) => {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
     if(err) {
        res.redirect('/campgrounds')
     } else {
        res.redirect(`/campgrounds/${req.params.id}`)
     }
   })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
var express = require('express')
var router = express.Router();

const Campground = require('../model/campground')


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

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/", isLoggedIn, (req, res) => {
  const {
    name,
    image,
    description
  } = req.body
  const {
    id,
    username
  } = req.user
  const author = {
    id,
    username
  }
  const newCampground = {
    name: name,
    image: image,
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
router.get('/:id/edit', checkCampgroundOwnerShip, (req, res) => {
      Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {
          campground: foundCampground
        })
      })
})

    // UPDATE CAMPGROUND ROUTE
    router.put('/:id', checkCampgroundOwnerShip, (req, res) => {
      Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
          res.redirect('/campgrounds')
        } else {
          res.redirect(`/campgrounds/${req.params.id}`)
        }
      })
    })

    // TODO: DESTROY CAMPGROUND ROUTE
    router.delete('/:id', checkCampgroundOwnerShip, (req, res) => {
      Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
          res.redirect('/campgrounds')
        } else {
          res.redirect('/campgrounds')
        }
      })
    })

    function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.redirect('/login')
    }

    function checkCampgroundOwnerShip(req, res, next) {
      if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
          if (err) {
            res.redirect('back')
          } else {
            if (foundCampground.author.id.equals(req.user._id)) {
              next()
            } else {
              res.redirect('back')
            }
          }
        })
      } else {
        res.redirect('back')
      }
    }

    module.exports = router
const express = require('express')
const router = express.Router();
const passport = require('passport')
const md5 = require('md5')
const User = require('../models/user')
const Campground = require('../models/campground')

router.get("/", (req, res) => {
  res.render("home");
});

//Show register form
router.get('/register', (req, res) => {
  res.render('register')
});

router.post('/register', (req, res) => {
  const hash = md5(req.body.email.trim().toLowerCase())
  const avatar = `https://www.gravatar.com/avatar/${hash}`
  const {username, firstName, lastName, email} = req.body
  const newUser = new User({username, firstName, lastName, email, avatar})
  if (req.body.adminCode === 'secret') {
    newUser.isAdmin = true
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      req.flash('error', err.message)
      return res.render('register')
    } else {
      passport.authenticate('local')(req, res, function() {
        req.flash('success', `Welcome to YelpCamp ${user.username}`)
        res.redirect('/campgrounds')        
      })
    }
  })
})


//show login form
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login',passport.authenticate('local', 
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }), (req, res) => {
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Logged you out')
  res.redirect('/campgrounds')
});

router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      req.flash('error', 'Something went wrong')
      res.redirect('/')
    }
    Campground.find().where('author.id').equals(user._id).exec((err, campgrounds) => {
      if (err) {
        req.flash('error', 'Something went wrong')
        res.redirect('/')
      }
      res.render('user/show', { user, campgrounds })
    })
  })
})


module.exports = router
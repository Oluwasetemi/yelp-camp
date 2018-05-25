const express = require('express')
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')

router.get("/", (req, res) => {
  res.render("home");
});

//Show register form
router.get('/register', (req, res) => {
  res.render('register')
});

router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username})
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


module.exports = router
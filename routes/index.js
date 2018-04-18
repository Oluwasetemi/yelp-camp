var express = require('express')
var router = express.Router();
const passport = require('passport')
const User = require('../model/user')

router.get("/", (req, res) => {
  res.render("home");
});

//Show register form
router.get('/register', (req, res) => {
  res.render('register')
});

router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      return res.render('register')
    } else {
      passport.authenticate('local')(req, res, function() {
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
  res.redirect('/campgrounds')
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
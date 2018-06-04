const express = require('express')
const router = express.Router();
const passport = require('passport')
const md5 = require('md5')
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

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
})

router.get('/forgot', (req, res) => {
	res.render('password-reset')
})

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, (err, buf) => {
        let token = buf.toString('hex')
        done(err, token)
      })
    }, function (token, done) {
      User.findOne({ email: req.body.email }), (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email address exists')
          return res.redirect('/forgot')
        }

        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000

        user.save((err) => {
          done(err, token, user)
        })
      }
    }, function (token, user, done) {
      let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'tiphen101@gmail.com',
          pass: process.env.GMAILPW
        }
      })
      let mailOptions = {
        to: user.email,
        from: 'tiphen101@gmail.com',
        subject: 'Node.js Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password.
        http://${req.headers.host}/reset/${token}
        If you did not request this, please ignore this email and your password will remain unchanged`
      }
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', `An email has been sent to ${user.email} with further instructions` )
        done(err, 'done')
      })
    }, function (err) {
      if (err) return next(err)
      res.redirect('/forgot')
    }
  ])
 res.send('working')
})

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
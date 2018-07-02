const express = require('express')
const router = express.Router();
const passport = require('passport')
const md5 = require('md5')
const mongoose = require('mongoose')
const async = require('async')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

let smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'tiphen101@gmail.com',
    pass: process.env.GMAILPW
  }
})

const User = mongoose.model('User')
const Campground = mongoose.model('Campground')

router.get("/", (req, res) => {
  res.render("home")
});

//Show register form
router.get('/register', (req, res) => {
  res.render('register')
});

router.post('/register', (req, res) => {
  const hash = md5(req.body.email.trim().toLowerCase())
  const avatar = `https://www.gravatar.com/avatar/${hash}`
  const {
    username,
    firstName,
    lastName,
    email
  } = req.body
  const newUser = new User({
    username,
    firstName,
    lastName,
    email,
    avatar
  })
  if (req.body.adminCode === 'secret') {
    newUser.isAdmin = true
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      if (err.code = 11000) {
        req.flash('error', `user with ${req.body.email} exist already`)
      } else {
        req.flash('error', err.message)
      }
      return res.redirect('back')
    } else {
      passport.authenticate('local')(req, res, function () {
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

router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  successFlash: 'You are now logged in!',
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
}), (req, res) => {})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Logged you out')
  res.redirect('/campgrounds')
})

router.get('/forgot', (req, res) => {
  res.render('forgot')
})

router.post('/forgot', (req, res, next) => {
  User.findOne({
    email: req.body.email
  }, (err, user) => {
    if (!user) {
      req.flash('error', 'No account with that email address exists')
      return res.redirect('/forgot')
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000
    console.log(user)

    let mailOptions = {
      to: user.email,
      from: 'tiphen101@gmail.com',
      subject: 'Node.js Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password.
    http://${req.headers.host}/reset/${user.resetPasswordToken}
    If you did not request this, please ignore this email and your password will remain unchanged`
    }

    user.save(() => console.log('i was saved'))

    smtpTransport.sendMail(mailOptions, (err, success) => {
      if (err) {
        return console.log('cannot send email' + err)
      } else {
        console.log('Email Sent')
        req.flash('success', `An email has been sent to ${user.email} with further instructions`)
      }
    })
    if (err) return next(err)
    req.flash('success', `An email has been sent to ${user.email} with further instructions`)
    console.log('sending email......')
    res.redirect('/forgot')
  })
})

router.get('/reset/:token', (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password Reset token is invalid or has expired.')
      res.redirect('/forgot')
    }
    res.render('reset', {
      token: req.params.token
    })
  })
})

router.post('/reset/:token', (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password Reset token is invalid or has expired.')
      res.redirect('/back')
    }
    if (req.body.password === req.body.confirm) {
      user.setPassword(req.body.password, (err) => {
        if (err) return console.log('Cannot complete password change')
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined

        user.save(() => {
          console.log('new user saved')
        })
        req.logIn(user, (err) => {
          if (err) {
            console.error('cannot sign in')
          } else {
            let mailOptions = {
              to: user.email,
              from: 'tiphen101@gmail.com',
              subject: 'Your Password has been changed',
              text: `
                  Hello,
                  This is a confirmation that the password for your account has been changed.
                  Regards.  `
            }
            smtpTransport.sendMail(mailOptions, (err, success) => {
              if (err) {
                console.error('can not send mail')
              } else {
                req.flash('success', 'Email sent.')
              }
            })

            req.flash('success', 'Success! Your password has been changed.')
            res.redirect('/campgrounds')
          }
        })
      })
    } else {
      req.flash('error', 'Passowrds do not match')
      return res.redirect('back')
    }
  })

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
      res.render('user/show', {
        user,
        campgrounds
      })
    })
  })
})

router.get('/api/search', function (req, res) {
  Campground.find({
      $text: {
        $search: req.query.q
      }
    }, {
      score: {
        $meta: 'textScore'
      }
    })
    .sort({
      score: {
        $meta: 'textScore'
      }
    })
    .limit(5)
    .exec(
      (err, foundCampground) => {
        if (!err) {
          res.json(foundCampground)
        } else {
          console.log(err)
        }
      }
    )
})


module.exports = router
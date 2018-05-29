require('dotenv').config({ path: 'variables.env' })
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const mongoose = require("mongoose");
const passport = require('passport')
const LocalStrategy = require('passport-local')
const flash = require('connect-flash')

const Campground = require('./models/campground')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seed')

const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')

const dbUrl = process.env.DATABASE_production || 'mongodb://localhost/yelp_camp'

mongoose.connect(dbUrl)
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
}
)

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())

// seedDB();

/**
|--------------------------------------------------
| PASSPORT CONFIGURATION
|--------------------------------------------------
*/
app.use(require('express-session')({
  secret: 'economy of key-strokes',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.moment = require('moment')
  res.locals.dump = (obj) => JSON.stringify(obj, null, 2)
  next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});

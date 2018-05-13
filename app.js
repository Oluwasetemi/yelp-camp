require('dotenv').config({ path: 'variables.env' })
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require('method-override')
const app = express();
const mongoose = require("mongoose");
const passport = require('passport')
const LocalStrategy = require('passport-local')

const Campground = require('./models/campground')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seed')

const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')



mongoose.connect(process.env.DATABASE_production)
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
}
)

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

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
  next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});

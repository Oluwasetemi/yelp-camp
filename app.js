var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
const passport = require('passport')
const LocalStrategy = require('passport-local')
var Campground = require('./model/campground')
var Comment = require('./model/comment')
var User = require('./model/user')
var seedDB = require('./seed')

const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

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


app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

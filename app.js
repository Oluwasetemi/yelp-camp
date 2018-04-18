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

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
seedDB();

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", (req, res) => {
  console.log(req.user)
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log('err');
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
    }
  })
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", (req, res) => {
  const { name, image, description } = req.body;
  // console.log(name, image);
  const newCampground = { name: name, image: image, description: description };
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("campgrounds");
    }
  })
});

app.get('/campgrounds/:id', (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log('err'); 
    } else {
      console.log(foundCampground);
      res.render('campgrounds/show', {campground: foundCampground})
    }
  })
});
/**
|--------------------------------------------------
| Comment Routes
|--------------------------------------------------
*/
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  const {id} = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground})
    }
  })
});

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
  const {id} = req.params
  Campground.findById(id,  (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('campgrounds')      
    } else {
      const {comment} = req.body
      Comment.create(comment, (err, comment) => {
        if (err) {
          console.log(err)  
        } else {
          campground.comments.push(comment)
          campground.save();
          res.redirect('/campgrounds')
        }
      })
    }  
  });
})

/**
|--------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------
*/
//Show register form
app.get('/register', (req, res) => {
  res.render('register')
});

app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login',passport.authenticate('local', 
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }), (req, res) => {
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/campgrounds')
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

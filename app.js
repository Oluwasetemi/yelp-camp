var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var Campground = require('./model/campground')
var Comment = require('./model/comment')
var seedDB = require('./seed')

mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))
seedDB();



app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log('err');
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
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
app.get('/campgrounds/:id/comments/new', (req, res) => {
  const {id} = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground})
    }
  })
});

app.post('/campgrounds/:id/comments', (req, res) => {
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
app.listen(3000, () => {
  console.log("App listening on port 3000!");
});

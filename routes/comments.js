var express = require('express')
var router = express.Router({mergeParams: true})

const Campground = require('../model/campground')
const Comment = require('../model/comment')

router.get('/new', isLoggedIn, (req, res) => {
  const {id} = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground})
    }
  })
});

router.post('/', isLoggedIn, (req, res) => {
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = router
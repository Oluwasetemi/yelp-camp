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
  const {comment} = req.body
  Campground.findById(id,  (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('campgrounds')      
    } else {
      Comment.create(comment, (err, comment) => {
        if (err) {
          console.log(err)  
        } else {
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          comment.save();
          campground.comments.push(comment)
          campground.save();
          console.log(`=========================`);
          // console.log(comment);
          res.redirect('/campgrounds/'+campground._id)
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
const Campground = require('../model/campground')
const Comment = require('../model/comment')
const middlewareObj = {}

middlewareObj.checkCampgroundOwnerShip = function() {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect('back')
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next()
        } else {
          res.redirect('back')
        }
      }
    })
  } else {
    res.redirect('back')
  }
}

middlewareObj.checkCommentOwnerShip = function() {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect('back')
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next()
        } else {
          res.redirect('back')
        }
      }
    })
  } else {
    res.redirect('back')
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

module.exports = middlewareObj
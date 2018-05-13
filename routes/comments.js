const express = require('express')
const router = express.Router({mergeParams: true})
const middleware = require('../middleware')

const Campground = require('../models/campground')
const Comment = require('../models/comment')

router.get('/new', middleware.isLoggedIn, (req, res) => {
  const {id} = req.params;
  Campground.findById(id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground})
    }
  })
});

router.post('/', middleware.isLoggedIn, (req, res) => {
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
          // console.log(comment);
          res.redirect('/campgrounds/'+campground._id)
        }
      })
    }  
  });
})

router.get('/:comment_id/edit', middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err) {
      res.redirect('back')
    } else {
      res.render('comments/edit', { campground_id:req.params.id, comment: foundComment })
    }
  })
})

// TODO:
router.put('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err) {
      res.redirect('back')
    } else {
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

router.delete('/:comment_id', middleware.checkCommentOwnerShip, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err) {
      res.redirect('back')
    } else {
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

module.exports = router
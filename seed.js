 var mongoose = require('mongoose')
var Campground = require('./model/campground')
var Comment = require('./model/comment')

var data = [
  {
    name: 'Wakajaye House',
    image: 'https://cdn.pixabay.com/photo/2017/10/28/23/18/indians-2898463__340.jpg',
    description: 'The first abode, daddy built her but now we are runnning from her in search of survival.'
  }, 
  {
    name: 'Abuja Crib',
    image: 'https://cdn.pixabay.com/photo/2018/03/15/13/36/bike-3228237__340.jpg',
    description: 'Small comfort , dope structure but surrounded with uncertainity and tales that hold tears',
  }, 
  {
    name: 'UCH quartets 074',
    image: 'https://cdn.pixabay.com/photo/2018/01/22/17/32/nature-3099457__340.jpg',
    description: 'The modern house with everything you want but she is small and welcoming.'
  }
]

function seedDB() {
  Campground.remove({}, (err) => {
    /* if(err) {
      console.log(err);
    }
    // console.log('data removed')
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log('All the data was inserted')
          Comment.create({
            text: 'This place is great, but I wish there was internet',
            'author': 'Stephen'
          }, (err, comment) => {
            if (err) {
              console.log(err);
            } else {
              campground.comments.push(comment) 
              campground.save()
              console.log('create a comment');
            }
          })
        }
      })
    }) */
  }) 
}

module.exports = seedDB
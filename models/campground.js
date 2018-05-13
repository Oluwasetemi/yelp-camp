const mongoose = require('mongoose')

//Schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String, 
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

//Model
module.exports = mongoose.model("Campground", campgroundSchema);
// Campground.create({
//   name: "Salmon geek",
//   image: "https://farm4.staticflickr.com/3717/12822913975_18e8b3e69d.jpg",
//   description: 'It is a very wonderful place to visit, good toilet, network for internet: A safe haven'
// }, (err, campground) => {
//   if (err) {
//     console.log(err); 
//   } else {
//     console.log('New data campground inserted to db');
//     console.log(campground);
//   }
// });

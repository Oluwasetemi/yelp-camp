const mongoose = require('mongoose')

//Schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  imageId: String,
  description: String,
  location: String,
  lat: Number,
  lng: Number,
  price: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
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

campgroundSchema.index({
  name: 'text',
  description: 'text'
})

//Model
module.exports = mongoose.model("Campground", campgroundSchema);


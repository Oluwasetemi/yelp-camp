const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
    required: 'You can only be an Admin or User'
  }
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
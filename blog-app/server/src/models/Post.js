const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    min: 1
  },
  title: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Post = mongoose.model('Post', PostSchema)

module.exports = Post

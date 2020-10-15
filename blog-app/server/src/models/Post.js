var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment')

const db = require('../config/keys').MongoURL

var connection = mongoose.createConnection(db)

autoIncrement.initialize(connection)

var postSchema = new Schema({
  id: {
    type: Number,
    required: true
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

postSchema.plugin(autoIncrement.plugin, {
  model: 'Post',
  field: 'id',
  startAt: 1
})
const Post = connection.model('Post', postSchema)

module.exports = Post

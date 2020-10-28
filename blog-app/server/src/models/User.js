const config = require('src/config/keys');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(config.MONGO_URL);

autoIncrement.initialize(connection);

const schema = new Schema({
  id: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

schema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'id',
  startAt: 1
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.hash;
  }
});

const User = connection.model('User', schema);
module.exports = User;
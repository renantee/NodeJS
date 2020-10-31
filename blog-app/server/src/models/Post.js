module.exports = (connection) =>  {
  const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

  autoIncrement.initialize(connection);

  const schema = new Schema({
    id: {
      type: Number,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
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
  });

  schema.plugin(autoIncrement.plugin, {
    model: 'Post',
    field: 'id',
    startAt: 1
  });

  return connection.model('Post', schema);
}

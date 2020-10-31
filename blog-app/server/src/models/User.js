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
      delete ret.hash;
    }
  });

  return connection.model('User', schema);
}
const config = require('src/config/keys');
const mongoose = require('mongoose');
const connection = mongoose.createConnection(config.MONGO_URL, { useNewUrlParser: true });

// Models
const Post = require('src/models/Post')(connection);
const User = require('src/models/User')(connection);

module.exports = {
  create,
  getAll,
  getById,  
  update,
  delete: _delete
};

async function create(postParam) {  
  const post = new Post(postParam);

  // save post
  await post.save();

  // return newly-created post
  return post;
}

async function getAll() {  
  return await Post.find({}, null, { sort: { date: -1 } })
    .populate({ path: 'author', select: 'firstName lastName role', model: User });
}

async function getById(id) {
  return await Post.findOne({ id })
    .populate({ path: 'author', select: 'firstName lastName role', model: User });
}

async function update(id, postParam) {
  const post = await Post.findOne({ id })
    .populate({ path: 'author', select: 'firstName lastName role', model: User });

  // copy postParam properties to post
  Object.assign(post, postParam);

  // update existing post
  await post.save();

  // return updated post
  return post;
}

async function _delete(id) {
  await Post.findOneAndRemove({ id })
}
const config = require('src/config/keys');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Post model
const Post = require('src/models/Post');

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
  return await Post.find({}, null, { sort: { date: -1 } });
}

async function getById(id) {
  return await Post.findOne({ id });
}

async function update(id, postParam) {
  const post = await Post.findOne({ id });

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
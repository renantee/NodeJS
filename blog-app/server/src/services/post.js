const config = require('src/config/keys');
const mongoose = require('mongoose');
const connection = mongoose.createConnection(config.MONGO_URL, { useNewUrlParser: true });

// Models
const Post = require('src/models/Post')(connection);
const User = require('src/models/User')(connection);

module.exports = {
  create,
  getAll,
  getByAuthor,
  getById,
  update,
  delete: _delete
};

async function create(postParam) {  
  const post = new Post(postParam);
  const user = await User.findById(postParam.author);

  // save post
  await post.save();

  // update user's post list
  user.posts = user.posts.concat(post._id);
  await user.save();

  // return newly-created post
  return await Post.findById(post._id)
    .populate({ path: 'author', select: 'firstName lastName role', model: User });
}

async function getAll() {  
  return await Post.find({}, null, { sort: { date: -1 } })
    .populate({ path: 'author', select: 'firstName lastName role', model: User });
}

async function getByAuthor(author) {
  return await Post.find({ author })
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
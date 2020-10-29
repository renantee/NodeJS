const config = require('src/config/keys');
const mongoose = require('mongoose');
const connection = mongoose.createConnection(config.MONGO_URL, { useNewUrlParser: true });
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Models
const Post = require('src/models/Post')(connection);
const User = require('src/models/User')(connection);

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign({ sub: user.id }, config.SECRET, { expiresIn: '7d' });
    return {
      ...user.toJSON(),
      token
    };
  }
}

async function getAll() {
  return await User.find()
    .populate({ path: 'posts', select: 'title content date', model: Post });
}

async function getById(id) {
  return await User.findOne({ id })
    .populate({ path: 'posts', select: 'title content date', model: Post });
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findOne({ id });

  // validate
  if (!user) throw 'User not found';
  if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
      throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
      userParam.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  // update existing user
  await user.save();

  // return updated user
  return user.populate({ path: 'posts', select: 'title content date', model: Post });
}

async function _delete(id) {
  await User.findOneAndRemove({ id })
}
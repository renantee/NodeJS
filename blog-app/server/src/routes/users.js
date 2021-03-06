const express = require('express');
const router = express.Router();
const postService = require('src/services/post');
const userService = require('src/services/user');

// Routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/my-posts', getMyPosts);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
  userService.authenticate(req.body)
    .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch(err => next(err));
}

function register(req, res, next) {
  userService.create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function getAll(req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getCurrent(req, res, next) {
  userService.getById(req.user.sub)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}

function getMyPosts(req, res, next) {
  // Retrieve author details
  (async () => {
    const author = await userService.getById(req.user.sub);

    postService.getByAuthor(author._id)
      .then(posts => res.json(posts))
      .catch(err => next(err));
  })()
}

function getById(req, res, next) {
  userService.getById(req.params.id)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err));
}

function update(req, res, next) {
  userService.update(req.params.id, req.body)
    .then(user => user ? res.json(user) : res.sendStatus(404))
    .catch(err => next(err))
}

function _delete(req, res, next) {
  userService.delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err))
}
const express = require('express')
const router = express.Router()
const userService = require('src/services/user')

// routes
router.post('/authenticate', authenticate)
router.get('/', getAll)

module.exports = router

function authenticate(req, res, next) {
  userService.authenticate(req.body)
    .then(user => res.json(user))
    .catch(next)
}

function getAll(req, res, next) {
  userService.getAll()
    .then(users => res.json(users))
    .catch(next)
}
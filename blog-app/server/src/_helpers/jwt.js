const expressJwt = require('express-jwt')
const config = require('src/config/keys')

module.exports = jwt

function jwt() {
  const { secret } = config.SECRET;
  return expressJwt({ secret, algorithms: ['HS256'] }).unless({
    path: [
      // public routes that don't require authentication
      '/api/users/authenticate'
    ]
  });
}
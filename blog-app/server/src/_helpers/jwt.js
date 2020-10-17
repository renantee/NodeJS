const config = require('src/config/keys');
const expressJwt = require('express-jwt');
const userService = require('src/services/user');

module.exports = jwt;

function jwt() {
  const secret = config.SECRET;
  return expressJwt({ secret, algorithms: ['HS256'], isRevoked }).unless({
    path: [
      // public routes that don't require authentication
      '/',
      '/api/users/authenticate',
      '/api/users/register'
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  // revoke token if user no longer exists
  if (!user) {
    return done(null, true);
  }

  done();
}
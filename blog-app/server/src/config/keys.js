const MONGO_URL = process.env.MONGO_URL || 'localhost'
const SECRET = process.env.SECRET || 'secret'

module.exports = {
  MONGO_URL: MONGO_URL,
  SECRET: SECRET
}

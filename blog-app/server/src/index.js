require('dotenv').config()
require('rootpath')()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('src/_helpers/jwt')
const errorHandler = require('src/_helpers/error-handler')

const { body, validationResult } = require('express-validator')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// use JWT auth to secure the api
//app.use(jwt())

// Post model
const Post = require('src/models/Post')

// Error handler
function createError(message) {
  return {
    errors: [
      {
        message
      }
    ]
  }
}

// Endpoint to check if API is working
app.get('/', (req, res) => {
  res.send({
    status: 'online'
  })
})

// Endpoint to create post
app.post(
  '/api/posts/', 
  // Express validator middleware function to identify which 
  // fields to validate
  [
    body('title').isString(),
    body('content').isString()
  ],
  (req, res) => {
  // Retrieve errors from function
  const errors = validationResult(req)

  // If there are errors in validation, return the array of 
  // error messages with the status of 422 Unprocessable 
  // Entity
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  // Retrieve variables from the request body
  const { title, content } = req.body

  const post = new Post({
    title,
    content
  })

  post.save((err, post) => {
    if (err) {
      return res.status(500).json({ errors: err })
    }
      
    return res.status(201).send(post)
  })
})

// Endpoint to list all the posts
app.get('/api/posts/', (req, res) => {
  Post.find({}, null, { sort: { date: -1 } }, (err, posts) => {
    if (err) {
      return res.status(500).send(
        createError(err)
      )
    }

    // Return the list of posts
    // status code 200 to signify successful retrieval
    res.send(posts)
  })
})

// Endpoint to retrieve a post by its id
app.get('/api/posts/:id', (req, res) => {
  // Store id in variable from the path parameter
  const id = req.params.id

  Post.findOne({ id: id }, (err, post) => {
    if(err) {
      return res.status(400).send(
        createError('Post not found')
      )
    }

    // Return the post with the status code 200
    // to signify successful retrieval
    res.send(post)
  })
})

// Endpoint update post by its id
app.put(
  '/api/posts/:id',
  // Express validator middleware function to identify which 
  // fields to validate
  [
    body('title').isString(),
    body('content').isString()
  ],
  (req, res) => {

  // Retrieve errors from function
  const errors = validationResult(req)

  // If there are errors in validation, return the array of 
  // error messages with the status of 422 Unprocessable 
  // Entity
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  // Store id in variable from the path parameter
  const id = req.params.id

  // Retrieve variables from the request body
  const { title, content } = req.body

  const updatedPost = {
    id,
    title,
    content
  }

  Post.updateOne({ id: id }, updatedPost, (err, post) => {
    if(!post) {
      return res.status(400).send(
        createError('Post not found')
      )
    }

    // Return the post with the status code 200
    // to signify successful retrieval
    res.send(updatedPost)
  })
})

// Endpoint to delete post by its id
app.delete('/api/posts/:id', (req, res) => {
  // Store id in variable from the path parameter
  const id = req.params.id

  Post.deleteOne({ id: id }, (err) => {
    if (err) {
      return res.status(500).send(
        createError(err)
      )
    }

    // Return the post with the status code 200
    // to signify successful deletion
    res.send({
      'message': `Post with id ${id} has been successfully deleted`
    })
  })
})

// API routes
app.use('/api/users', require('src/routes/users'))

// Return an error if route does not exist in our server
app.all('*', (req, res) => {
  return res.status(404).send(
     createError('Not found')
  )
})

// Global error handler
app.use(errorHandler)

// Set port
const PORT = process.env.PORT || 3000

// Expose endpoints to port ${PORT}
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
})
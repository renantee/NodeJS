// Import dotenv
require('dotenv').config()

// Import express
const express = require('express')

// Import lodash
const _ = require('lodash')

// Import body parser
const bodyParser = require('body-parser')

// Import express validator
const { body, validationResult } = require('express-validator')

// Initialize express
const app = express()

// Use the body parser middleware to allow 
// express to recognize JSON requests
app.use(bodyParser.json())

// Post model
const Post = require('./models/Post')

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
  });
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
  });
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
  });
})

// Return an error if route does not exist in our server
app.all('*', (req, res) => {
  return res.status(404).send(
     createError('Not found')
  )
})

// Set port
const PORT = process.env.PORT || 3000

// Expose endpoints to port ${PORT}
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
})
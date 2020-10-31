require('dotenv').config();
require('rootpath')();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('src/_helpers/jwt');
const errorHandler = require('src/_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// Endpoint to check if API is working
app.get('/', (req, res) => {
  res.send({
    status: 'online'
  });
});

// API routes
app.use('/api/posts', require('src/routes/posts'));
app.use('/api/users', require('src/routes/users'));

// Return an error if route does not exist in our server
app.all('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 3000;

// Expose endpoints to port ${PORT}
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

app.get('/', (req, res) => {
  res.send('Hello World!!!');
})

// List
app.get('/api/courses', (req, res) => {
  res.send(courses);
})

// Read
app.get('/api/courses/:id', (req, res) => {
  const course = findCourse(req);

  if (!course) {
    return res.status(404).send('The course with the given ID was not found!');
  }

  res.send(course);
})

// Create
app.post('/api/courses', (req, res) => {
  // using object destructor
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };

  // add new course
  courses.push(course);

  // return the new course
  res.send(course);
});

// Update
app.put('/api/courses/:id', (req, res) => {
  const course = findCourse(req);

  if (!course) {
    return res.status(404).send('The course with the given ID was not found!');
  }

  // using object destructor
  const { error } = validateCourse(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // update course
  course.name = req.body.name;

  // return the updated course
  res.send(course);
})

// Delete
app.delete('/api/courses/:id', (req, res) => {
  const course = findCourse(req);

  if (!course) {
    return res.status(404).send('The course with the given ID was not found!');
  }

  const index = courses.indexOf(course);

  // delete course
  courses.splice(index, 1)

  // send the deleted course
  res.send(course);
})

// Function to find a course
function findCourse(req) {
  return courses.find(c => c.id === parseInt(req.params.id));
}

// Function to validate a course
function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
const fs = require('fs');

// Synchronous method
/*const files = fs.readdirSync('./');
console.log(files);*/

// Asynchronous method
fs.readdir('./', function(err, files) {
  if (err) console.log('Error', err);
  else console.log('Result', files)
})
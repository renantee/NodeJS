const http = require('http')

const hostname = '127.0.0.1'
const port = '8080'

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello Node.js!\n')
})

server.listen(port, hostname, () => {  
  console.log('All parameters')
  process.argv.forEach((val, index) => {    
    console.log(`${index}: ${val}`)
  })

  console.log('\nExclude first 2 parameters')
  const args = process.argv.slice(2)
  
  args.forEach((val, index) => {
    console.log(`${index}: ${val}`)
  })

  console.log('\nUsing minimist')
  const args2 = require('minimist')(process.argv.slice(2))
  console.log(args2['name'])
})
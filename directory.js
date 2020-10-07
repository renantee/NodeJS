const fs = require('fs')
const path = require('path')

const folderPath = 'd:\\nante\\www\\NodeJS'

fs.readdirSync(folderPath).map(fileName => {
  console.log(fileName)
})
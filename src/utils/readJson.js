const fs = require('fs')

const readJson = (path) => {
  return new Promise((resolve) => {
    fs.readFile(path, (err, content) => {
      if (err) {
        return resolve()
      }
      resolve(JSON.parse(content))
    })
  })
}

module.exports = readJson
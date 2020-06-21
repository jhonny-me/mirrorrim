const google = require('../vendor/google');
const path = require('path');
const write = require("write");

const DEFAULT_PATH = path.join(__dirname, '../../resources/google.csv');
const fileId = '13PRkyoSfdpRJhTlY8xtyX8jrXuhzAZmS1iPL2c9L8Ek';

const downloadCsv = (destPath = DEFAULT_PATH) => {
  return google.generateDrive()
    .then(drive => drive.files.export({
      fileId,
      mimeType: 'text/csv'
    }))
    .then(({data}) => write(destPath, data))
    .then(() => Promise.resolve(destPath))
}

module.exports = {
  downloadCsv
}
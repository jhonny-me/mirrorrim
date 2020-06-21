const google = require('../vendor/google');
const path = require('path');
const write = require("write");

const outputFileName = 'google.csv';
const DEFAULT_PATH = path.join(__dirname, '../../output');
// const fileId = '13PRkyoSfdpRJhTlY8xtyX8jrXuhzAZmS1iPL2c9L8Ek';

const downloadCsv = ({destPath = DEFAULT_PATH, credentials, fileId}) => {
  const fullPath = path.join(destPath, outputFileName);
  return google.generateDrive({destPath, credentials})
    .then(drive => drive.files.export({
      fileId,
      mimeType: 'text/csv'
    }))
    .then(({data}) => write(fullPath, data))
    .then(() => Promise.resolve(fullPath))
}

module.exports = {
  downloadCsv
}
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const write = require("write");

const FILENAME_WITHOUT_EXTENSION = "download"

const downloadCsv = ({destPath, downloadUrl}) => {
  const fileExtension = downloadUrl.substring(downloadUrl.lastIndexOf('.'));
  const fileFullPath = path.join(destPath, FILENAME_WITHOUT_EXTENSION + fileExtension);
  const file = fs.createWriteStream(fileFullPath);

  return axios.get(downloadUrl)
    .then(res => write(fileFullPath, res.data))
    .then(() => Promise.resolve(fullPath));
}

module.exports = {
  downloadCsv,
};
const axios = require('axios');
const fs = require('fs');
const path = require("path");

const FILENAME_WITHOUT_EXTENSION = "download"

const downloadFile = ({destPath, downloadUrl}) => {
  if (isValidHttpUrl(downloadUrl) == false) { 
    // if it's local path, just return it
    return Promise.resolve(downloadUrl)
  }

  const fileExtension = downloadUrl.substring(downloadUrl.lastIndexOf('.'));
  const fileFullPath = path.join(destPath, FILENAME_WITHOUT_EXTENSION + fileExtension);
  const file = fs.createWriteStream(fileFullPath);

  return axios({
    method: 'get',
    url: downloadUrl,
    responseType: 'stream',
  })
  .then(response => {
    return new Promise((resolve, reject) => {
      response.data
        .on("end", () => {
          // wait 1s for the file to create.
          setTimeout(() => {
            resolve(fileFullPath);
          }, 1000);
        })
        .on("error", (err) => {
          reject(err)
        })
        .pipe(file);
    });
  });
}

function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

module.exports = {
  downloadFile,
};
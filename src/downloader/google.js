const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
];

const outputFileName = "download.xlsx";
const DEFAULT_PATH = path.join(__dirname, "../../output");

const downloadCsv = ({ destPath = DEFAULT_PATH, credentials, fileId }) => {
  const fullPath = path.join(destPath, outputFileName);
  var auth;
  if (credentials.endsWith('json')) {
    auth = new google.auth.GoogleAuth({
      keyFile: credentials,
      scopes: SCOPES,
    });
  } else {
    auth = credentials;
  }
  
  const drive = google.drive({ version: "v3", auth });
  return new Promise((resolve, reject) => {
    drive.files.export({
      fileId,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }, {responseType: "stream"}, (err, {data}) => {
      if (err) {
        reject(err);
      }
      var dest = fs.createWriteStream(fullPath);
      data
        .on("end", () => {
          // wait 1s for the file to create.
          setTimeout(() => {
            resolve(fullPath);
          }, 1000);
        })
        .on("error", (err) => {
          reject(err)
        })
        .pipe(dest);
    })
  });
};

module.exports = {
  downloadCsv,
};

const { google } = require("googleapis");
const path = require("path");
const write = require("write");

const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.readonly",
];

const outputFileName = "google.csv";
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
  return drive.files.export({
      fileId,
      mimeType: "text/csv"
    })
    .then(({ data }) => write(fullPath, data))
    .then(() => Promise.resolve(fullPath));
};

module.exports = {
  downloadCsv,
};

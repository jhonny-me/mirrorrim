const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = path.join(__dirname, '../../token.json');
// const Cridential_PATH = path.join(__dirname, '../../credentials.json');

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize({destPath, credentials}) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  const tokenPath = path.join(destPath, 'token.json');

  // Check if we have previously stored a token.
  return new Promise((resolve, reject) => {
    fs.readFile(tokenPath, (err, token) => {
      if (err) {
        getAccessToken(oAuth2Client, tokenPath)
          .then(client => resolve(client))
          .catch(error => reject(error));
        return
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, tokenPath) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) { 
          reject(err);
          return console.error('Error retrieving access token', err);
        }
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', tokenPath);
        });
        resolve(oAuth2Client);
      });
    });
  });
}

// Load client secrets from a local file.
const generateDrive = ({destPath, credentials}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(credentials, (err, content) => {
      if (err) {
        reject(err);
        return console.log('Error loading client secret file:', err); 
      }
      // Authorize a client with credentials, then call the Google Drive API.
      authorize({destPath, credentials: JSON.parse(content)}).then(client => {
        const result = google.drive({version: 'v3', auth: client});
        resolve(result);
      }).catch(error => reject(error));
    });
  })
}

module.exports = {
  generateDrive
};
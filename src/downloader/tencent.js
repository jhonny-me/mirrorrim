const axios = require('axios');
const plainUrl = require("./downloader/plainUrl");

const downloadFile = async (destPath, {tencentFileId, tencentToken, tencentHost}) => {

  console.log("Connected to Tencent service, exporting...")
  return axios.get(`${tencentHost}/export?token=${tencentToken}&doc_id=${tencentFileId}`)
          .then((operationId) => {
            return new Promise((resolve, reject) => {
              const interval = setInterval(async () => {
                try {
                  const { data: { progress, url } } = await axios.get(`${tencentHost}/progress?token=${tencentToken}&doc_id=${tencentFileId}&operation_id=${operationId}`)
                  if (url) {
                    console.log('Exporting succeed!!!');
                    clearInterval(interval);
                    const path = await plainUrl.downloadFile({
                      destPath: destPath,
                      downloadUrl: url
                    });
                    resolve(path);
                  } else {
                    // TODO: integrate with https://github.com/npkgz/cli-progress
                    console.log(`Exporting progress: ${progress}`);
                  }
                } catch (error) {
                  reject(error);
                }
              }, 2000);
            });
          });
}

module.exports = {
  downloadFile,
};
const { Command } = require("commander");
const { version } = require("../package.json");
const ios = require("./lib/ios");
const android = require("./lib/android");
const google = require("./downloader/google");
const plainUrl = require("./downloader/plainUrl");
const tencent = require("./downloader/tencent");
const readJson = require("./utils/readJson");
const tokenParser = require("./utils/tokenParser");
const fs = require('fs');

const DEFAULT_OPTIONS = {
  // local
  filePath: null,
  // google
  googleFileId: null,
  googleCredential: "AIzaSyC-L0al8mmyplmsIu3Ko4CZBpJZ1PKfOUc",
  // tencent
  tencentFileId: null,
  tencentHost: "https://api.mirrorrim.cn",

  outputDir: "./outputs",
  platforms: ["ios", "android"],
  config: ".mirrorrim",
};
const PACKAGE_FILE = "package.json";
const PACKAGE_OPTIONS_KEY = "mirrorrim";

const platformMap = {
  ios: ios,
  android: android,
};

const collect = (value, previous) => {
  return previous.concat([value]);
};

const getArrayOption = (optionArray, key) => {
  let value;
  const notNullArray = optionArray.filter(o => o);
  for (var i = 0; i < notNullArray.length; i++) {
    const optionValue = notNullArray[i][key];
    if (optionValue && optionValue.length) {
      value = optionValue;
    }
  }
  return value;
}

const getOptions = async (argv) => {
  let options = new Command()
    .option(
      "--output-dir <string>",
      `output file base directory, default: ${DEFAULT_OPTIONS.outputDir}`
    )
    .option(
      "--platforms <string>",
      `output platforms, default: ${DEFAULT_OPTIONS.platforms}`,
      collect,
      []
    )
    // .option('--downloader <string>', `downloader for input, default: ${DEFAULT_OPTIONS.downloader}`)
    .option(
      "--file-path <file>",
      `file for local csv input, default: ${DEFAULT_OPTIONS.filePath}`
    )
    .option(
      "--google-file-id <string>",
      "google file id, you can find it in the url"
    )
    .option(
      "--google-credential <file>",
      `file for google credentials, default: ${DEFAULT_OPTIONS.googleCredential}`
    )
    .option(
      "--tencent-file-id <string>",
      "tencent file id, you can find it in the url"
    )
    .option(
      "--tencent-host <string>",
      `tencent service url, default: ${DEFAULT_OPTIONS.tencentHost}, ONLY modify if you have a self-hosted service, see https://github.com/jhonny-me/mirrorrim_serverless for HOWTOs`
    )
    // TODO: Instruction for how to generate tencent user token
    .option(
      "--tencent-token <string>",
      `user token for tencent credentials, how to generate? Follow: xxxx`
    )
    .version(version)
    .parse(argv);

  const pkg = await readJson(PACKAGE_FILE);
  const packageOptions = pkg ? pkg[PACKAGE_OPTIONS_KEY] : null;
  const dotOptions = await readJson(options.config || DEFAULT_OPTIONS.config);
  const platforms = getArrayOption([DEFAULT_OPTIONS, dotOptions, packageOptions, options], 'platforms');

  return {
    ...DEFAULT_OPTIONS,
    ...dotOptions,
    ...packageOptions,
    ...options._optionValues,
    platforms
  };
};

const run = async (argv) => {
  const options = await getOptions(argv);
  try {
    let path;
    if (options.filePath) {
      path = await plainUrl.downloadFile({
        destPath: options.outputDir,
        downloadUrl: options.filePath
      })
    } else if (options.googleFileId) {
      path = await google.downloadFile({ 
        destPath: options.outputDir,
        credentials: options.googleCredential,
        fileId: options.googleFileId,
      });
    } else if (options.tencentFileId && options.tencentToken) {
      path = await tencent.downloadFile(options.outputDir, options);
    } else {
      console.log(`Error: To run this app, you need one of these:
  - path to local/remote xlsx with file-path param
  - google file id with google-file-id param
  - tencent file id with tencent-file-id param and tencent token configured
        `);
      process.exit();
    }
    const array = await tokenParser.parse(path);
    const platforms = options.platforms;
    for (var i = 0; i < platforms.length; i++) {
      const generator = platformMap[platforms[i]];
      if (!generator) continue;
      await generator.generateFile(array, options.outputDir);
    }
    // delete downloaded google sheet
    if (options.googleFileId) {
      fs.unlink(path, err => {
        // Don't care if the delete fails
      })
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  run,
};

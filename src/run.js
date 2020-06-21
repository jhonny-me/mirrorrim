const { Command } = require("commander");
const { version } = require("../package.json");
const csv = require("csv-parser");
const fs = require("fs");
const ios = require("./lib/ios");
const android = require("./lib/android");
const google = require("./downloader/google");
const readJson = require("./utils/readJson");

const DEFAULT_OPTIONS = {
  // local
  inputPath: null,
  // google
  googleFileId: null,
  googleCredential: "./credentials.json",

  outputDir: "./output",
  platforms: ["ios", "android"],
  config: ".multi-language",
};
const PACKAGE_FILE = "package.json";
const PACKAGE_OPTIONS_KEY = "multi-language";

const platformMap = {
  ios: ios,
  android: android,
};

const collect = (value, previous) => {
  return previous.concat([value]);
};

const getOptions = async (argv) => {
  const options = new Command()
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
      "--input-path <file>",
      `file for local csv input, default: ${DEFAULT_OPTIONS.inputPath}`
    )
    .option(
      "--google-file-id <string>",
      "google file id, you can find it in the url"
    )
    .option(
      "--google-credential <file>",
      `file for google credentials, default: ${DEFAULT_OPTIONS.googleCredential}`
    )
    .version(version)
    .parse(argv);

  const pkg = await readJson(PACKAGE_FILE);
  const packageOptions = pkg ? pkg[PACKAGE_OPTIONS_KEY] : null;
  const dotOptions = await readJson(options.config || DEFAULT_OPTIONS.config);

  return {
    ...DEFAULT_OPTIONS,
    ...dotOptions,
    ...packageOptions,
    ...options,
  };
};

const formatKey = (key) => {
  const removespace = key.replace(/[_ ]/, "&&&");
  const words = removespace.split("&&&").map((s) => s.toLowerCase());
  return words.join("_");
};

const readFromCsv = (filepath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (data) => {
        var { key } = data;
        results.push({
          ...data,
          key: formatKey(key),
        });
      })
      .on("end", () => {
        results.sort((lhs, rhs) => lhs.key > rhs.key);
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const run = async (argv) => {
  // const path = input || "./resources/test.csv";
  const options = await getOptions(argv);
  try {
    let path;
    if (options.inputPath) {
      path = options.inputPath;
    } else if (options.googleFileId) {
      path = await google.downloadCsv({
        destPath: options.outputDir,
        credentials: options.googleCredential,
        fileId: options.googleFileId,
      });
    } else {
      console.log(`Error: To run this app, you need one of these:
  - path to local csv with input-path param
  - google file id with google-file-id param
        `);
      process.exit();
    }
    const array = await readFromCsv(path);
    const platforms = options.platforms;
    for (var i = 0; i < platforms.length; i++) {
      const generator = platformMap[platforms[i]];
      if (!generator) continue;
      await generator.generateFile(array, options.outputDir);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  run,
};

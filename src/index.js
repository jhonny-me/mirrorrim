const csv = require("csv-parser");
const fs = require("fs");
const ios = require("./lib/ios");
const android = require("./lib/android");

const generators = [ios, android];

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

const main = async (input) => {
  const path = input || "./resources/test.csv";
  try {
    const array = await readFromCsv(path);
    for (var i = 0; i < generators.length; i++) {
      await generators[i].generateFile(array);
    }
  } catch (err) {
    console.log(err);
  }
};

main();

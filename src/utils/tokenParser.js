const R = require("ramda");
const csv = require("csv-parser");
const fs = require("fs");
var XLSX = require("xlsx");
const path = require("path");

const formatKey = (key) => {
  const removespace = key.trim().toLowerCase().replace(/[!@#$%^&*() , .?'":{}|<>]+/g, "_");
  return removespace;
};

const sortByKey = R.sortBy(R.prop('key'));

const readFromCsv = (filepath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on("data", (data) => {
        var data = JSON.parse(JSON.stringify(data))
        console.log(data)
        console.log(Object.keys(data))
        var { key, KEY, Key } = data;
        const safeKey = key || KEY || Key;
        console.log(safeKey)
        if (safeKey && safeKey.length > 0) {
          results.push({
            ...data,
            key: formatKey(safeKey),
          });
        }
      })
      .on("end", () => {
        console.log(results, filepath);
        resolve(sortByKey(results));
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const convertToCsv = (filepath) => {
  const fileExtension = path.extname(filepath);
  const dirname = path.dirname(filepath);
  const basename = path.basename(filepath, ".xlsx"); 
  console.log(filepath, fileExtension, dirname, basename)
  if(fileExtension === ".csv") { 
    return Promise.resolve(filepath); 
  } else if(fileExtension === ".xlsx") {
    var workbook = XLSX.readFile(filepath);
    const csvFullPath = path.join(dirname, basename + '.csv');
    XLSX.writeFile(workbook, csvFullPath);
    return Promise.resolve(csvFullPath);
    return
  } else {
    return Promise.reject("Invalid file format, it should be either csv or xlsx");
  }
}

const parse = filepath => convertToCsv(filepath).then(path => readFromCsv(path))

module.exports = {
  parse,
};


const R = require("ramda");
var XLSX = require("xlsx");

const formatKey = (key) => {
  const removespace = key.trim().toLowerCase().replace(/[!@#$%^&*() , .?'":{}|<>]+/g, "_");
  return removespace;
};

const sortByKey = R.sortBy(R.prop('key'));

const readFromFile = (filepath) => {
  return new Promise((resolve, reject) => {
    try {
      var workbook = XLSX.readFile(filepath);
      var jsa = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      var results = jsa.reduce((result, data) => {
        var { key, KEY, Key } = data;
        const safeKey = key || KEY || Key;
        if (safeKey && safeKey.length > 0) {
          result.push({
            ...data,
            key: formatKey(safeKey),
          });
        }
        return result;
      }, []);
      resolve(sortByKey(results));
    } catch (error) {
      reject(error);
    }
  });
};

const parse = filepath => readFromFile(filepath)

module.exports = {
  parse,
};


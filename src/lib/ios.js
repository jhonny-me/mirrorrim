const generateHeader = require("./header");
const write = require("write");
const path = require("path");
const keyExtractor = require('./keysExtractor');

const generateFilePath = (key) => {
  switch (key.toLowerCase()) {
    case "en":
    case "english":
      return "en.lproj/Localizable.strings";
    case "zh":
    case "cn":
    case "chinese":
      return "zh-Hans.lproj/Localizable.strings";
    default:
      return "";
  }
};

const generateFile = (data, basePath) => {
  const header = generateHeader.ios();
  const languages = keyExtractor(data);
  const generators = languages.map((l) => {
    const filepath = generateFilePath(l);
    if (filepath.length < 1) {
      // unrecongnized language key, skip
      return Promise.resolve()
    }
    const fullpath = path.join(basePath, filepath);
    const content = data.reduce((result, next) => {
      const rawValue = next[l]
      if (rawValue) {
        const value = formatValue(rawValue);
        return result + `"${next.key}" = "${value}";\n`;  
      } else { // value missing, skipping this key
        return result;
      }
    }, "");
    return write(fullpath, `${header}\n${content}`);
  });
  return Promise.all(generators);
};

const formatValue = (input) => {
  var input = String(input)
  var input = input.replace(/"/g, '\\\"')
  input = input.replace(/(\r\n|\r|\n)/g, "") // remove breakline
  input = input.replace(/%s/g, '%@')
  return input
}

module.exports = {
  generateFile,
};

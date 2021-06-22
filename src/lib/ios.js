const generateHeader = require("./header");
const write = require("write");
const path = require("path");

const generateFilePath = (key) => {
  switch (key) {
    case "EN":
    case "en":
    case "english":
      return "en.lproj/Localizable.strings";
    case "ZH":
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
  const languages = Object.keys(data[0]).filter((k) => k !== "key" && k.length > 0);
  const generators = languages.map((l) => {
    const filepath = generateFilePath(l);
    if (filepath.length < 1) {
      // unrecongnized language key, skip
      return Promise.resolve()
    }
    const fullpath = path.join(basePath, filepath);
    const content = data.reduce((result, next) => {
      const value = formatValue(next[l]);
      return result + `"${next.key}" = "${value}";\n`;
    }, "");
    return write(fullpath, `${header}\n${content}`);
  });
  return Promise.all(generators);
};

const formatValue = (input) => {
  var input = input.replace(/"/g, '\\\"')
  input = input.replace(/%s/g, '%@')
  return input
}

module.exports = {
  generateFile,
};

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
      return "base.lproj/Localizable.strings";
  }
};

const generateFile = (data, basePath) => {
  const header = generateHeader();
  const languages = Object.keys(data[0]).filter((k) => k !== "key" && k.length > 0);
  const generators = languages.map((l) => {
    const filepath = path.join(basePath, generateFilePath(l));
    const content = data.reduce((result, next) => {
      const value = next[l].replace('%s', '%@');
      return result + `"${next.key}" = "${value}";\n`;
    }, "");
    return write(filepath, `${header}\n${content}`);
  });
  return Promise.all(generators);
};

module.exports = {
  generateFile,
};

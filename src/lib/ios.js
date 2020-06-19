const generateHeader = require("./header");
const write = require("write");

const generateFilePath = (key) => {
  switch (key) {
    case "en":
    case "english":
      return "en.lproj/Localizable.strings";
    case "zh":
    case "cn":
    case "chinese":
      return "zh-Hans.lproj/Localizable.strings";
    default:
      return "base.lproj/Localizable.strings";
  }
};

const generateFile = (array) => {
  const header = generateHeader();
  const languages = Object.keys(array[0]).filter((k) => k !== "key");
  const generators = languages.map((l) => {
    const filepath = generateFilePath(l);
    const content = array.reduce((result, next) => {
      return result + `"${next.key}" = "${next[l]}";\n`;
    }, "");
    return write(filepath, `${header}\n${content}`);
  });
  return Promise.all(generators);
};

module.exports = {
  generateFile,
};

const generateHeader = require("./header");
const write = require("write");
const path = require("path");

const generateFilePath = (key) => {
  switch (key) {
    case "EN":
    case "en":
    case "english":
      return "values/strings.xml";
    case "ZH":
    case "zh":
    case "cn":
    case "chinese":
      return "values-zh/strings.xml";
    default:
      return "values/strings.xml";
  }
};

const generateFile = (data, basePath) => {
  const header = generateHeader();
  const languages = Object.keys(data[0]).filter((k) => k !== "key");
  const generators = languages.map((l) => {
    const filepath = path.join(basePath, generateFilePath(l));
    const content = data.reduce((result, next) => {
      return result + `    <string name="${next.key}">${next[l]}</string>\n`;
    }, "");
    const fullContent = `<resources>\n${content}\n</resources>`;
    return write(filepath, `${header}\n${fullContent}`);
  });
  return Promise.all(generators);
};

module.exports = {
  generateFile,
};

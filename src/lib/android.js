const generateHeader = require("./header");
const write = require("write");
const path = require("path");

const generateFilePath = (key) => {
  switch (key.toLowerCase()) {
    case "en":
    case "english":
      return "values/strings.xml";
    case "zh":
    case "cn":
    case "chinese":
      return "values-zh/strings.xml";
    default:
      return "";
  }
};

const generateFile = (data, basePath) => {
  const header = generateHeader.android();
  const languages = Object.keys(data[0]).filter((k) => k !== "key" && k.length > 0);
  const generators = languages.map((l) => {
    const filepath = generateFilePath(l);
    if (filepath.length < 1) {
      // unrecongnized language key, skip
      return Promise.resolve();
    }
    const fullpath = path.join(basePath, filepath);
    const content = data.reduce((result, next) => {
      const value = formatValue(next[l])
      return result + `    <string name="${next.key}">${value}</string>\n`;
    }, "");
    const fullContent = `<resources>\n${content}\n</resources>`;
    return write(fullpath, `${header}\n${fullContent}`);
  });
  return Promise.all(generators);
};

const formatValue = (input) => {
  var input = input.replace(/'/g, '\\\'')
  input = input.replace(/&/g, '&amp;')
  input = input.replace(/"/g, '\\\"')
  input = input.replace(/</g, '&lt;')
  input = input.replace(/>/g, '&gt;')
  return input
}

module.exports = {
  generateFile,
};
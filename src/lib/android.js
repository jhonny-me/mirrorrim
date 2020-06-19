const generateHeader = require("./header");
const write = require("write");

const generateFilePath = (key) => {
  switch (key) {
    case "en":
    case "english":
      return "values-en/strings.xml";
    case "zh":
    case "cn":
    case "chinese":
      return "values-zh/strings.xml";
    default:
      return "values/strings.xml";
  }
};

const generateFile = (array) => {
  const header = generateHeader();
  const languages = Object.keys(array[0]).filter((k) => k !== "key");
  const generators = languages.map((l) => {
    const filepath = generateFilePath(l);
    const content = array.reduce((result, next) => {
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

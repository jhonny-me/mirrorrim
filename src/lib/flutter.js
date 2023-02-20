const generateHeader = require("./header");
const write = require("write");
const path = require("path");
const keyExtractor = require('./keysExtractor');

const generateFilePath = (key) => {
  switch (key.toLowerCase()) {
    case "en":
    case "english":
      return "intl_en.arb";
    case "zh":
    case "cn":
    case "chinese":
      return "intl_zh_CN.arb";
    default:
      return "";
  }
};

const generateFile = (data, basePath) => {
  const header = generateHeader.flutter();
  const languages = keyExtractor(data);
  const generators = languages.map((l) => {
    const filepath = generateFilePath(l);
    if (filepath.length < 1) {
      // unrecongnized language key, skip
      return Promise.resolve()
    }
    const fullpath = path.join(basePath, filepath);
    const content = data.reduce((result, next, currentIndex) => {
      const rawValue = next[l]
      if (rawValue) {
        const value = formatValue(rawValue);
        var suffix = ',\n'
        if (currentIndex == data.length - 1) {
          suffix = ''; 
        }
        return result + '\t' + `"${next.key}": "${value}"${suffix}`;  
      } else { // value missing, skipping this key
        return result;
      }
    }, "");
    return write(fullpath, `${header}\n{\n${content}\n}`);
  });
  return Promise.all(generators);
};

const formatValue = (input) => {
  var input = String(input)
  var input = input.replace(/"/g, '\\\"')
  input = input.replace(/(\r\n|\r|\n)/g, "") // remove breakline
  var arguIndex = 0
  while (input.includes("%s")) {
    input = input.replace("%s", `{argu${arguIndex}}`);
    arguIndex++;
  }
  return input
}

module.exports = {
  generateFile,
};

const generateHeader = () => {
  const now = new Date().toString();
  var header = `// 
// This is a generated file, DO NOT EDIT
// See https://github.com/jhonny-me/multi-language-mobile
// Generated at ${now}
//
`;
  return header;
};

module.exports = generateHeader;

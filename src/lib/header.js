
const generateHeader = () => {
  const now = new Date().toString();
  var header = `// 
// This is a generated file, DO NOT EDIT
// See xxx
// Generated at ${now}
//
`;
  return header;
};

module.exports = generateHeader;

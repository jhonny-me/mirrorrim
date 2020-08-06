
const generateIosHeader = () => {
  const now = new Date().toString();
  var header = `// 
// This is a generated file, DO NOT EDIT
// See https://github.com/jhonny-me/multi-language-mobile
// Generated at ${now}
//
`;
  return header;
};

const generateAndroidHeader = () => {
  const now = new Date().toString();
  var header = `
<!--
This is a generated file, DO NOT EDIT
See https://github.com/jhonny-me/multi-language-mobile
Generated at ${now}
-->
`;
  return header;
}

module.exports = {
  ios: generateIosHeader,
  android: generateAndroidHeader
};

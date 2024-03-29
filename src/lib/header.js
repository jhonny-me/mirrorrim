
const generateIosHeader = () => {
  const now = new Date().toString();
  var header = `// 
// This is a generated file, DO NOT EDIT
// See https://github.com/jhonny-me/mirrorrim
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
See https://github.com/jhonny-me/mirrorrim
Generated at ${now}
-->
`;
  return header;
}

const generateFlutterHeader = () => {
  //flutter localization file can't input comment
  return '';
}

module.exports = {
  ios: generateIosHeader,
  android: generateAndroidHeader,
  flutter: generateFlutterHeader
};

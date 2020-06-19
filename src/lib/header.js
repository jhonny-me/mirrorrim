/*
  Localizable.strings
  Starbucks

  Created by Leo Zhou on 2017/9/28.
  Copyright © 2017年 Wiredcraft. All rights reserved.
*/

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

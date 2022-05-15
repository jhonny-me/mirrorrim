const fs = require('fs');
const path = require('path');
const ios = require('./reader/ios');
const android = require('./reader/android');
const R = require("ramda");

const sortByKey = R.sortBy(R.prop('KEY'));

async function exists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

const concat = (oldArray, newArray) => {
  const oldKeys = oldArray.map(obj => obj.KEY);
  const newKeys = newArray.map(obj => obj.KEY);
  const concatedKeys = Array.from(new Set([...oldKeys, ...newKeys]));
  const concatedArray = concatedKeys.map(key => {
    let oldObj = oldArray.find(obj => obj.KEY === key);
    let newObj = newArray.find(obj => obj.KEY === key);
    return {
      ...oldObj,
      ...newObj
    }
  });
  return concatedArray;
}

const filehit = async (inputDir) => {
  let keyValues = [];
  let iOSen = path.join(inputDir, "en.lproj/Localizable.strings");
  if (fs.existsSync(iOSen)) {
    // parse ios en
    console.log('found: ', iOSen)
    keyValues = await ios.read(iOSen, 'EN');
  }

  let iOSzh = path.join(inputDir, "zh-Hans.lproj/Localizable.strings");
  if (fs.existsSync(iOSzh)) {
    // parse ios zh
    console.log('found: ', iOSzh)
    keyValues = concat(keyValues, await ios.read(iOSzh, 'ZH'));
  }

  let androidEn = path.join(inputDir, "values/strings.xml");
  if (fs.existsSync(androidEn)) {
    // parse android en
    console.log('found: ', androidEn)
    keyValues = concat(keyValues, await android.read(androidEn, 'EN'));
  }

  let androidZh = path.join(inputDir, "values-zh/strings.xml");
  if (fs.existsSync(androidZh)) {
    // parse andoird zh
    console.log('found: ', androidZh)
    keyValues = concat(keyValues, await android.read(androidZh, 'ZH'));
  }
  return sortByKey(keyValues);
}

module.exports = {
  hit: filehit
}
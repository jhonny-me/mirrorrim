const extract = (array) => {
  const languageSet = array.reduce((result, next) => {
    const nextLanguages = Object.keys(next).filter((k) => k !== "key" && k.length > 0);
    return new Set([...result, ...nextLanguages]);
  }, new Set())
  return Array.from(languageSet);
}

module.exports = extract;
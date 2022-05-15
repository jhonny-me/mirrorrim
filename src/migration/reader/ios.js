const events = require('events');
const fs = require('fs');
const readline = require('readline');

const read = async (filepath, languageKey) => {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(filepath),
      crlfDelay: Infinity
    });
    let outputs = [];
    rl.on('line', (line) => {
      const array = line.split(" = ", 2);
      if (array.length < 2) { return }
      const key = array[0].slice(1, -1);
      const value = array[1].slice(1, -2);

      outputs.push({
        KEY: key,
        [languageKey]: formatValue(value)
      });
    });

    await events.once(rl, 'close');
    return outputs;
  } catch (err) {
    console.error(err);
  }
}

const formatValue = (input) => {
  var input = String(input)
  var input = input.replace(/\\'/g, '\'')
  input = input.replace(/&amp;/g, '&')
  input = input.replace(/\\\\"/g, '\"')
  input = input.replace(/&lt;/g, '<')
  input = input.replace(/&gt;/g, '>')
  input = input.replace(/%@/g, '%s')
  return input
}

module.exports = {
  read
}
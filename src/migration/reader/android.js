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
      if (!line.endsWith("<\/string>")) { return }
      const value = line.replace(/[\s]+<string name="[^>]+">/, "").replace("<\/string>", "");
      
      const key = line.slice(line.indexOf("\"") + 1, line.indexOf("\">"));

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
  var input = input.replace(/\\\\'/g, '\'')
  input = input.replace(/&amp;amp;/g, '&')
  input = input.replace(/\\\\"/g, '\"')
  input = input.replace(/&amp;lt;/g, '<')
  input = input.replace(/&amp;gt;/g, '>')
  return input
}

module.exports = {
  read
}
#!/usr/bin/env node

const { Command } = require("commander");
const { version } = require("../package.json");
const filehit = require("./migration/filehit");
const path = require("path");
var XLSX = require("xlsx");

const DEFAULT_OPTIONS = {
  // local
  inputDir: "./",

  outputDir: "./",
};

const getOptions = async (argv) => {
  let options = new Command()
    .option(
      "--output-dir <string>",
      `output excel base directory, default: ${DEFAULT_OPTIONS.outputDir}`
    )
    .option(
      "--input-dir <string>",
      `directory of all wording resources, default: ${DEFAULT_OPTIONS.inputDir}`
    )
    .version(version)
    .parse(argv);

  return {
    ...DEFAULT_OPTIONS,
    ...options._optionValues
  };
};

const run = async (argv) => {
  const options = await getOptions(argv);
  try {
    if (options.inputDir) {
      let rows = await filehit.hit(options.inputDir);
      if (rows.length < 1) {
        console.warn("Warning: No string files found in input directory");
        return
      }
      const sheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, "DEFAULT");
      /* calculate column width */
      const keys = Object.keys(rows[0]);
      const columnWidthes = keys.map(key => {
        const width = rows.reduce((w, r) => Math.min(60, Math.max(w, r[key].length + 1)), 10);
        return { wch: width }
      })
      sheet["!cols"] = columnWidthes;

      const outputPath = path.join(options.outputDir, "strings.xlsx");
      XLSX.writeFile(workbook, outputPath);
      console.log(`Success! Xlsx file generated at ${outputPath}`);
    } else {
      console.log('Error: To run this app, you need to specify the input directory of string resources');
      process.exit();
    }
  } catch (err) {
    console.log(err);
  }
};

run(process.argv).catch((error) => {
  console.log("\n");
  console.error(error);
  process.exit(1);
});

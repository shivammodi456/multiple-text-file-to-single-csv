const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const uniqeKeys = [];
const allFileData = [];
const removedLines = []; //insert number of line which needs to excluded eg :- [1,3,4]

const removedKeys = removedLines.map((key) => `field-${key}`);
const files = fs.readdirSync(path.join(__dirname, "/textFiles"));

files.forEach(function (file) {
  const singleFileObj = {};
  const singleFileData = fs
    .readFileSync(path.join(__dirname, `/textFiles/${file}`), "utf-8")
    .split(/\r?\n/);
  singleFileData.forEach((key, i) => (singleFileObj[`field-${i}`] = key));
  allFileData.push(singleFileObj);
});

allFileData.forEach((obj) => {
  Object.keys(obj).forEach((key) => {
    if (!uniqeKeys.includes(key) && removedKeys.indexOf(key) < 0) {
      uniqeKeys.push(key);
    }
  });
});
const headers = uniqeKeys.map((uniqK) => {
  return { id: uniqK, title: uniqK };
});
const csvWriter = createCsvWriter({
  path: "Output.csv",
  header: headers,
});
csvWriter.writeRecords(allFileData).then(() => {
  console.log("CSV Generated.....");
});

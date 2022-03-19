const fs = require("fs");
const lodash = require("lodash");
//requiring path and fs modules
const path = require("path");
//joining path of directory
const finalData = [];
const directoryPath = path.join(__dirname, "/textFile");
const uniqeKeys = [];
const removedLines = [1, 2, 3];
const removedKeys = removedLines.map((key) => `name--${key}`);
//passsing directoryPath and callback function
const files = fs.readdirSync(directoryPath);

files.forEach(function (file, i) {
  const data = require("fs")
    .readFileSync(`./textFile/${file}`, "utf-8")
    .split(/\r?\n/);
  const data1 = lodash.mapKeys(data, function (value, key) {
    return "name--" + key;
  });
  finalData.push(data1);
});

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
function createCSV() {
  finalData.forEach((array) => {
    lodash.forIn(array, function (value, key) {
      if (!uniqeKeys.includes(key) && removedKeys.indexOf(key) < 0) {
        uniqeKeys.push(key);
      }
    });
  });
  const headers = uniqeKeys.map((uniqK) => {
    return { id: uniqK, title: uniqK };
  });
  const csvWriter = createCsvWriter({
    path: "file.csv",
    header: headers,
  });
  csvWriter.writeRecords(finalData).then(() => {
    console.log("...Done");
  });
}
createCSV();

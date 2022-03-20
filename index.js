const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
var config = require("./config");

const uniqeKeys = [];
const allFilesData = [];
const removedLines = config.remove_lines;

const removedKeys = removedLines.map((key) => `field-${key}`);
const txtFiles = fs
  .readdirSync(path.join(__dirname, `/${config.text_file_path}`))
  .filter((file) => file.split(".")[1] === "txt");
if (txtFiles.length === 0) {
  console.log("There are no txt Files");
} else {
  txtFiles.forEach((file) => {
    const filePath = path.join(__dirname, `/${config.text_file_path}/${file}`);
    const singleFileObj = {};
    const singleFileData = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
    singleFileData.forEach((key, i) => (singleFileObj[`field-${i}`] = key));
    allFilesData.push(singleFileObj);
    if (config.delete_file_after_read) {
      fs.unlink(filePath, function (err) {
        if (err) {
          console.error(err);
        }
        console.log("File has been Deleted");
      });
    }
  });

  allFilesData.forEach((obj) => {
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
  csvWriter.writeRecords(allFilesData).then(() => {
    console.log("CSV Generated.....");
  });
}

const fs = require("fs");

const readFileData = (filePath, callback) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
    }
  });
};

const writeFileData = (filePath, data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    callback(err);
  });
};

module.exports = { readFileData, writeFileData };

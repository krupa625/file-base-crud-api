const fs = require("fs");

const readFileData = (filePath, callback) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
      //   callback(null, data);
    }
  });
};

const writeFileData = (filePath, data, callback) => {
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    callback(err);
  });
};
const sendResponse = (res, statusCode, message, data = null) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message, data }));
};

const validateData = (data) => {
  //validate data which is enter in post request
  let aKeys = Object.keys(data);
  let bool = false;
  aKeys.forEach((key) => {
    if (
      key !== "sName" &&
      key !== "nQuantity" &&
      key !== "nPrice" &&
      key !== "sStatus"
    ) {
      bool = true;
    }
  });

  if (bool) {
    return "Enter valid keys";
  }
  const { sName, nQuantity, nPrice, sStatus } = data;

  if (typeof sName !== "string") {
    return "name should be a string";
  }
  if (typeof nQuantity !== "number" || nQuantity <= 0) {
    return "quantity should be a number";
  }
  if (typeof nPrice !== "number" || nPrice <= 0) {
    return "price should be a number";
  }
  if (typeof sStatus !== "string") {
    return "Status should be a string";
  }

  return null;
};

module.exports = { readFileData, writeFileData, sendResponse, validateData };

const fs = require("fs");

const readFileData = (sFilePath, callback) => {
  fs.readFile(sFilePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, JSON.parse(data));
      //   callback(null, data);
    }
  });
};

// const readFileData = (sFilePath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(sFilePath, "utf8", (err, data) => {
//       if (err) {
//         reject(err); // Promise rejected with error
//       } else {
//         try {
//           resolve(JSON.parse(data)); // Promise resolved with parsed data
//         } catch (parseError) {
//           reject(parseError); // Error in JSON parsing
//         }
//       }
//     });
//   });
// };

// // Usage example
// readFileData("data.json")
//   .then((data) => console.log("Data:", data))
//   .catch((error) => console.error("Error:", error));

const writeFileData = (sFilePath, data, callback) => {
  fs.writeFile(sFilePath, JSON.stringify(data), (err) => {
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

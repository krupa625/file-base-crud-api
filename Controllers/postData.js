const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const logger = require("../EventHandler/eventLogger");

const postData = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  const validateData = (data) => {
    //validate data which is enter in post request
    let aKeys = Object.keys(data);
    let bool = false;
    aKeys.forEach((key) => {
      if (key !== "sName" && key !== "nQuantity" && key !== "nPrice") {
        bool = true;
        console.log(key);
      }
    });
    // console.log(aKeys);

    if (bool) {
      return "Enter valid keys";
    }
    const { sName, nQuantity, nPrice } = data;
    // console.log(typeof sName);
    // console.log(typeof nPrice);
    // console.log(typeof nQuantity);

    if (typeof sName !== "string") {
      return "name should be a string";
    }
    if (typeof nQuantity !== "number" || nQuantity <= 0) {
      return "quantity should be a number";
    }
    if (typeof nPrice !== "number" || nPrice <= 0) {
      return "price should be a number";
    }

    return null;
  };

  req.on("end", () => {
    const oNewItem = JSON.parse(body);
    // console.log(oNewItem);

    const error = validateData(oNewItem);
    if (error) {
      res.writeHead(400, { "Content-type": "application/json" });
      res.end(JSON.stringify({ message: error }));
      return;
    }
    oNewItem.id = uuidv4();
    oNewItem.createdAt = new Date().toLocaleString();
    oNewItem.updatedAt = oNewItem.createdAt; //assign currentdat and update that
    // console.log(oNewItem);

    try {
      fs.readFile("data.json", "utf8", (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(err, { message: "Error reading file" });
        }
        const aItems = JSON.parse(data);
        aItems.push(oNewItem);

        fs.writeFile("data.json", JSON.stringify(aItems), (writeErr) => {
          if (writeErr) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error saving data" }));
            return; //write the data into data.json
          }

          logger.log(`Item Created: ${JSON.stringify(oNewItem)}`); //log added into log.txt file

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(oNewItem));
        });
      });
    } catch (err) {
      res.end(err, { message: "Something went wrong!" });
    }
  });
};

module.exports = postData;

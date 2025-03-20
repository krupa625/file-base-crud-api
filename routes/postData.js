const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const logger = require("../eventLogger");

const postData = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  const validateData = (data) => {
    //validate data which is enter in post request
    const { sName, nQuantity, nPrice } = data;
    if (sName !== "string") {
      return "name should be a string";
    }
    if (nQuantity !== Number || nQuantity <= 0) {
      return "quantity should be a number";
    }
    if (nPrice !== Number || nPrice <= 0) {
      return "price should be a number";
    }
    return null;
  };

  req.on("end", () => {
    const newItem = JSON.parse(body);
    newItem.id = uuidv4();
    newItem.createdAt = new Date().toString();
    newItem.updatedAt = newItem.createdAt; //assign currentdat and update that

    const error = validateData(newItem);
    if (error) {
      res.writeHead(400, { "content-type": "Application/json" });
      res.end(JSON.stringify({ message: error }));
      return;
    }

    try {
      fs.readFile(path.join(__dirname, "../data.json"), "utf8", (err, data) => {
        const items = err ? [] : JSON.parse(data); //store newiteam into iteams

        if (items.find()) items.push(newItem);
        // console.log(items);

        fs.writeFile(
          path.join(__dirname, "../data.json"),
          JSON.stringify(items),
          (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "Error saving data" }));
              return; //write the data into data.json
            }

            logger.log(`Item Created: ${JSON.stringify(newItem)}`); //log added into log.txt file

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newItem));
            // console.log(newItem);
          }
        );
      });
    } catch (err) {
      res.end(err, { message: "Something went wrong!" });
    }
  });
};

module.exports = postData;

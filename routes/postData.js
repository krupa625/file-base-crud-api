const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const logger = require("../eventLogger");

const postData = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const newItem = JSON.parse(body);
    newItem.id = uuidv4();
    newItem.createdAt = new Date().toString();
    newItem.updatedAt = newItem.createdAt; //assign currentdata and update that

    fs.readFile(path.join(__dirname, "../data.json"), "utf8", (err, data) => {
      const items = err ? [] : JSON.parse(data); //store newiteam into iteams
      items.push(newItem);

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
        }
      );
    });
  });
};

module.exports = postData;

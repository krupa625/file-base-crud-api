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
    newItem.createdAt = new Date().toISOString();
    newItem.updatedAt = newItem.createdAt;

    fs.readFile(path.join(__dirname, "../data.json"), "utf8", (err, data) => {
      const items = err ? [] : JSON.parse(data);
      items.push(newItem);

      fs.writeFile(
        path.join(__dirname, "../data.json"),
        JSON.stringify(items, null, 2),
        (writeErr) => {
          if (writeErr) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error saving data" }));
            return;
          }

          logger.log(`Item Created: ${JSON.stringify(newItem)}`);

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(newItem));
        }
      );
    });
  });
};

module.exports = postData;

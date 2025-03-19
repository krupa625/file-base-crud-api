const fs = require("fs");
const url = require("url");

const putData = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const id = parsedUrl.pathname.split("/")[3]; // Extract ID from URL

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    fs.readFile("./data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error reading data" }));
        return;
      }

      let jsonData = JSON.parse(data);
      let itemIndex = jsonData.findIndex((item) => item.id === id);

      if (itemIndex === -1) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Item not found" }));
        return;
      }

      let updatedItem = {
        ...jsonData[itemIndex],
        ...JSON.parse(body),
        updatedAt: new Date(),
      };
      jsonData[itemIndex] = updatedItem;

      fs.writeFile("./data.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error updating data" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ message: "Data updated successfully", updatedItem })
        );
      });
    });
  });
};

module.exports = putData;

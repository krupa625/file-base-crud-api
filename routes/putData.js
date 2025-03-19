const fs = require("fs");
const url = require("url");

const putData = (req, res) => {
  const parsedUrl = url.parse(req.url, true); //parse id from url , true means pass query string into object
  const id = parsedUrl.pathname.split("/")[3]; // Extract ID

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

      let jsonData = JSON.parse(data); //convert json data into array or object
      let itemIndex = jsonData.findIndex((item) => item.id === id); //find the iteam of given id checking

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
      jsonData[itemIndex] = updatedItem; //copies of all jsondata with index and add into updated form

      fs.writeFile("./data.json", JSON.stringify(jsonData), (err) => {
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

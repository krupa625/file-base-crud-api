const fs = require("fs");
const url = require("url");

function getDataId(req, res) {
  const id = req.url.split("/")[3];
  try {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server Error" }));
      } else {
        const aJsonData = JSON.parse(data);
        // console.log(aJsonData);

        const oItem = aJsonData.find((obj) => obj.id === id); // Find item by ID
        // console.log(oItem);

        if (oItem) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(oItem));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Item not found" }));
        }
      }
    });
  } catch (err) {
    res.end(err, { message: "Something went wrong!" });
  }
}

module.exports = getDataId;

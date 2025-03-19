const fs = require("fs");
const url = require("url");

const deleteData = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const id = parsedUrl.pathname.split("/")[3]; // Extract ID from URL

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Error reading data" }));
      return;
    }

    let jsonData = JSON.parse(data);
    let filteredData = jsonData.filter((item) => item.id !== id);

    if (jsonData.length === filteredData.length) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Item not found" }));
      return;
    }

    fs.writeFile(
      "./data.json",
      JSON.stringify(filteredData, null, 2),
      (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error deleting data" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Data deleted successfully" }));
      }
    );
  });
};

module.exports = deleteData;

const fs = require("fs");
const url = require("url");

const deleteData = (req, res) => {
  const id = req.url.split("/")[3];

  try {
    fs.readFile("./data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error reading data" }));
        return;
      }

      let jsonData = JSON.parse(data); //convert json into stringdata
      let filteredData = jsonData.filter((item) => item.id !== id); //remove id from old iteams

      if (jsonData.length === filteredData.length) {
        //if iteam removed than main iteam length small if not then error
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Item not found" }));
        return;
      }

      fs.writeFile("./data.json", JSON.stringify(filteredData), (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error deleting data" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Data deleted successfully" }));
      });
    });
  } catch (err) {
    res.end(err, { message: "Something went wrong!" });
  }
};

module.exports = deleteData;

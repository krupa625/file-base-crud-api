const fs = require("fs");
const url = require("url");
const logger = require("../EventHandler/eventLogger");

const deleteData = (req, res) => {
  const id = req.url.split("/")[3];

  try {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error reading data" }));
        return;
      }

      let aJsonData = JSON.parse(data);
      // console.log(aJsonData);

      let aFilteredData = aJsonData.filter((item) => item.id !== id); //remove id from old iteams
      // console.log(aFilteredData);

      if (aJsonData.length === aFilteredData.length) {
        //if iteam removed than main iteam length small if not then error
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Item not found" }));
        return;
      }

      fs.writeFile("data.json", JSON.stringify(aFilteredData), (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error deleting data" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Data deleted successfully" }));
      });
      logger.log(`Item Deleted: ${JSON.stringify(aJsonData)}`); //log of deleted iteam into log.txt
    });
  } catch (err) {
    res.end(err, { message: "Something went wrong!" });
  }
};

module.exports = deleteData;

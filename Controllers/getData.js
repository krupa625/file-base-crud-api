const fs = require("fs");

function getData(req, res) {
  try {
    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }), err);
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data); //get data from data.json
    });
  } catch (err) {
    res.end(err, { message: "Something went wrong!" });
  }
}

module.exports = getData;

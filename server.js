const http = require("http");
const fs = require("fs");
const path = require("path");

const getData = require("./routes/getData");
const postData = require("./routes/postData");
const putData = require("./routes/putData");
const deleteData = require("./routes/deleteData");

const server = http.createServer((req, res) => {
  console.log("Method:", req.method);
  console.log("URL:", req.url);

  if (req.method === "GET" && req.url === "/") {
    // serve index.html file here
    fs.readFile(path.join(__dirname, "public", "index.html"), (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  } else if (req.method === "GET" && req.url === "/api/data") {
    getData(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/api/data/")) {
    const id = req.url.split("/")[3]; //  /api/data/2cdea93c -> Extract "2cdea93c"

    fs.readFile("data.json", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Server Error" }));
      } else {
        const jsonData = JSON.parse(data);
        const item = jsonData.find((obj) => obj.id === id); // Find item by ID

        if (item) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(item));
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Item not found" }));
        }
      }
    });
  } else if (req.method === "POST" && req.url === "/api/data") {
    postData(req, res);
  } else if (req.method === "PUT" && req.url.startsWith("/api/data/")) {
    putData(req, res);
  } else if (req.method === "DELETE" && req.url.startsWith("/api/data/")) {
    deleteData(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3030, () => {
  console.log("Server running at http://localhost:3030");
});

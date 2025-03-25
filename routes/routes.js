const fs = require("fs");
const path = require("path");

const {
  deleteData,
  getData,
  getDataId,
  postData,
  putData,
} = require("../Controllers/iteam.controller");
const { sendResponse, readFileData, validateData } = require("./helper1");

const route = (req, res) => {
  console.log("URL:", req.url);
  console.log("Method:", req.method);

  if (req.method === "GET" && req.url === "/") {
    //serving static file here

    const filePath = path.join(__dirname, "../public/index.html");
    console.log(filePath);
    // readFileData(filePath, (err, data) => {
    //   if (err) {
    //     return sendResponse(res, 404, "Not Found");
    //   } else {
    //     return sendResponse(res, 200, "content-type: text/html", data);
    //   }
    // });

    try {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } catch (err) {
      res.end(err, { message: "Something went wrong!" });
    }
  } else if (req.method === "GET" && req.url === "/api/data") {
    getData(req, res);
  } else if (req.method === "GET" && req.url === "/api/data") {
    getData(req, res);
  } else if (req.method === "GET" && req.url.startsWith("/api/data/")) {
    getDataId(req, res);
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
};

module.exports = route;

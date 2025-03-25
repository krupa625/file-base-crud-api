const http = require("http");

const router = require("./routes/index");
const server = http.createServer((req, res) => {
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  router.handleRequest(req, res);
});

server.listen(3030, () => {
  console.log("Server running at http://localhost:3030");
});

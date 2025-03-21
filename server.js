const http = require("http");
const handleRoutes = require("./routes/routes");

const server = http.createServer((req, res) => {
  handleRoutes(req, res, __dirname);
});
server.listen(3030, () => {
  console.log("Server running at http://localhost:3030");
});

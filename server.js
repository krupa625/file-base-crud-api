const http = require("http");
const handleroutes = require("./routes/routes");

const server = http.createServer((req, res) => {
  handleroutes(req, res);
});
server.listen(3030, () => {
  console.log("Server running at http://localhost:3030");
});

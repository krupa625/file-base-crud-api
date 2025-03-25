const sendResponse = (res, statusCode, message, data = null) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message, data }));
};

module.exports = { sendResponse };

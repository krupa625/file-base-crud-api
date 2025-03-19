const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

class Logger extends EventEmitter {
  log(message) {
    const logMessage = `${new Date().toString()} - ${message}`;
    console.log(logMessage);

    fs.appendFileSync(path.join(__dirname, "log.txt"), logMessage, "utf8");
  }
}

module.exports = new Logger();

const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

class Logger extends EventEmitter {
  log(message) {
    const logMessage = `${new Date().toString()} - ${message}\r\n`; //log msg added into log.txt file
    // console.log(logMessage);
    process.stdout.write(logMessage);
    try {
      fs.appendFileSync(path.join(__dirname, "log.txt"), logMessage); //create log.txt file
    } catch (err) {
      console.log("Error adding file");
    }
  }
}

module.exports = new Logger(); //Logger object reference of class

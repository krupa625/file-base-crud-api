const { v4: uuidv4 } = require("uuid");
const { sendResponse } = require("../utils/responseHelper");
const { readFileData, writeFileData } = require("../middleware/fileHandler");
const Logger = require("../EventHandler/eventLogger");

class UserController {
  get(req, res) {
    readFileData("../public/index.html", (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Server Error");
      } else {
        sendResponse(res, 200, "Serving file", data);
      }
    });
  }
  getDataId(req, res) {
    console.log("Request Params:", req.params);
    const iId = req.params.id;

    readFileData("data.json", (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Server Error");
      }
      console.log(typeof data);

      const oItem = data.find((obj) => obj.iId == iId);
      console.log(iId);

      console.log(oItem);

      if (oItem) {
        sendResponse(res, 200, "Data fetched successfully", oItem);
      } else {
        sendResponse(res, 404, "Item not found");
      }
    });
  }

  getData(req, res) {
    readFileData("./data.json", (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Internal Server Error");
      }
      sendResponse(res, 200, "Data fetched successfully", data);
      // console.log(data);

      Logger.on("getdata", (data) => {
        console.log("Getting data:", data);
      });
      Logger.emit("getdata");
    });
  }

  deleteData(req, res) {
    const { iId } = req.params;

    readFileData("./data.json", (err, data) => {
      if (err) return sendResponse(res, 500, "Error reading data");

      const filteredData = data.filter((item) => item.id !== iId);

      if (filteredData.length === data.length) {
        return sendResponse(res, 404, "Item not found");
      }

      writeFileData("./data.json", filteredData, (writeErr) => {
        if (writeErr) return sendResponse(res, 500, "Error deleting data");
        sendResponse(res, 200, "Data deleted successfully");
      });
    });
  }

  postData(req, res) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let newItem = JSON.parse(body);
      newItem.iId = uuidv4();
      newItem.dCreatedAt = new Date().toLocaleString();
      newItem.dUpdatedAt = newItem.dCreatedAt;

      readFileData("./data.json", (err, data) => {
        if (err) return sendResponse(res, 500, "Error reading data");

        data.push(newItem);

        writeFileData("./data.json", data, (writeErr) => {
          if (writeErr) return sendResponse(res, 500, "Error saving data");
          sendResponse(res, 201, "Item created successfully", newItem);
        });
      });
    });
  }

  putData(req, res) {
    const { iId } = req.params;
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let updatedItem = JSON.parse(body);
      updatedItem.updatedAt = new Date().toLocaleString();

      readFileData("./data.json", (err, data) => {
        if (err) return sendResponse(res, 500, "Error reading data");

        const itemIndex = data.findIndex((item) => item.id === iId);

        if (itemIndex === -1) {
          return sendResponse(res, 404, "Item not found");
        }

        data[itemIndex] = { ...data[itemIndex], ...updatedItem };

        writeFileData("./data.json", data, (writeErr) => {
          if (writeErr) return sendResponse(res, 500, "Error updating data");
          sendResponse(res, 200, "Data updated successfully", data[itemIndex]);
        });
      });
    });
  }
}

module.exports = new UserController();

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
      Logger.on("get", () => {
        console.log("getting data", oItem);
      });
      Logger.emit("get");
    });
  }

  getData(req, res) {
    readFileData("./data.json", (err, data) => {
      if (err) {
        return sendResponse(res, 500, "Internal Server Error");
      }
      sendResponse(res, 200, "Data fetched successfully", data);
      // console.log(data);

      Logger.on("getdata", () => {
        console.log("Getting data:", data);
      });
      Logger.emit("getdata");
    });
  }

  deleteData(req, res) {
    const { iId } = req.params;

    readFileData("./data.json", (err, data) => {
      if (err) return sendResponse(res, 500, "Error reading data");

      const aFilteredData = data.filter((item) => item.id !== iId);

      if (aFilteredData.length === data.length) {
        return sendResponse(res, 404, "Item not found");
      }
      Logger.log(`Item Deleted: ${JSON.stringify(aFilteredData)}`);

      writeFileData("./data.json", aFilteredData, (writeErr) => {
        if (writeErr) return sendResponse(res, 500, "Error deleting data");
        sendResponse(res, 200, "Data deleted successfully");
      });
      Logger.on("deletedata", () => {
        console.log("Deleting data");
      });
      Logger.emit("deletedata");
    });
  }

  postData(req, res) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let oNewItem = JSON.parse(body);
      oNewItem.iId = uuidv4();
      oNewItem.dCreatedAt = new Date().toLocaleString();
      oNewItem.dUpdatedAt = oNewItem.dCreatedAt;

      readFileData("./data.json", (err, data) => {
        if (err) return sendResponse(res, 500, "Error reading data");

        data.push(oNewItem);
        Logger.log(`Item Created: ${JSON.stringify(oNewItem)}`);

        writeFileData("./data.json", data, (writeErr) => {
          if (writeErr) return sendResponse(res, 500, "Error saving data");
          sendResponse(res, 201, "Item created successfully", oNewItem);
        });
        Logger.on("postdata", () => {
          console.log("created data:", oNewItem);
        });
        Logger.emit("postdata");
      });
    });
  }

  putData(req, res) {
    const { iId } = req.params;
    let body = "";

    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      let oUpdatedItem = JSON.parse(body);
      oUpdatedItem.updatedAt = new Date().toLocaleString();

      readFileData("./data.json", (err, data) => {
        if (err) return sendResponse(res, 500, "Error reading data");

        const aItemIndex = data.findIndex((item) => item.id === iId);

        if (aItemIndex === -1) {
          return sendResponse(res, 404, "Item not found");
        }

        data[aItemIndex] = { ...data[aItemIndex], ...oUpdatedItem };
        Logger.log(`Item Updated: ${JSON.stringify(oUpdatedItem)}`);

        writeFileData("./data.json", data, (writeErr) => {
          if (writeErr) return sendResponse(res, 500, "Error updating data");
          sendResponse(res, 200, "Data updated successfully", data[aItemIndex]);
        });
        Logger.on("updatedata", () => {
          console.log("updating data:", data[aItemIndex]);
        });
        Logger.emit("updatedata");
      });
    });
  }
}

module.exports = new UserController();

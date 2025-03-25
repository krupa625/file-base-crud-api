const {
  readFileData,
  writeFileData,
  sendResponse,
  validateData,
} = require("../routes/helper1");
const { v4: uuidv4 } = require("uuid");
const url = require("url");

const deleteData = (req, res) => {
  const iId = req.url.split("/")[3];

  readFileData("./data.json", (err, data) => {
    if (err) return sendResponse(res, 500, "Error reading data");

    const filteredData = data.filter((item) => item.iId !== iId);

    if (filteredData.length === data.length) {
      return sendResponse(res, 404, "Item not found");
    }

    writeFileData("./data.json", filteredData, (writeErr) => {
      if (writeErr) return sendResponse(res, 500, "Error deleting data");
      sendResponse(res, 200, "Data deleted successfully");
    });
  });
};
function getData(req, res) {
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
function getDataId(req, res) {
  const iId = req.url.split("/")[3];

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
const postData = (req, res) => {
  let body = "";
  req.on("data", (chunk) => (body += chunk));

  req.on("end", () => {
    const oNewItem = JSON.parse(body);
    // console.log(oNewItem);

    const error = validateData(oNewItem);
    if (error) {
      return sendResponse(res, 400, "message: error");
    }
    oNewItem.iId = uuidv4();
    oNewItem.dCreatedAt = new Date().toLocaleString();
    oNewItem.dUpdatedAt = oNewItem.dCreatedAt;

    readFileData("./data.json", (err, data) => {
      if (err) return sendResponse(res, 500, "Error reading data");

      data.push(oNewItem);

      writeFileData("./data.json", data, (writeErr) => {
        if (writeErr) return sendResponse(res, 500, "Error saving data");
        sendResponse(res, 201, "Item created successfully", oNewItem);
      });
    });
  });
};
const putData = (req, res) => {
  const iId = req.url.split("/")[3];
  let body = "";

  req.on("data", (chunk) => (body += chunk));

  req.on("end", () => {
    const error = validateData(JSON.parse(body));

    if (error) {
      return sendResponse(res, 400, "message: error");
    }
    let updatedItem = JSON.parse(body);

    updatedItem.dUpdatedAt = new Date().toLocaleString();

    readFileData("./data.json", (err, data) => {
      if (err) return sendResponse(res, 500, "Error reading data");

      const itemIndex = data.findIndex((item) => item.iId === iId);

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
};

module.exports = { deleteData, getData, getDataId, postData, putData };

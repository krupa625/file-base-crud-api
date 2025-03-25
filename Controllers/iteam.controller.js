const {
  readFileData,
  writeFileData,
  sendResponse,
  validateData,
} = require("../routes/helper1");
const { v4: uuidv4 } = require("uuid");
const url = require("url");
const Logger = require("../EventHandler/eventLogger");

const deleteData = (req, res) => {
  const iId = req.url.split("/")[3];

  readFileData("./data.json", (err, data) => {
    if (err) return sendResponse(res, 500, "Error reading data");

    const aFilteredData = data.filter((item) => item.iId !== iId);
    Logger.log(`Item Deleted: ${JSON.stringify(aFilteredData)}`);

    if (aFilteredData.length === data.length) {
      return sendResponse(res, 404, "Item not found");
    }

    writeFileData("./data.json", aFilteredData, (writeErr) => {
      if (writeErr) return sendResponse(res, 500, "Error deleting data");
      sendResponse(res, 200, "Data deleted successfully");
    });
  });
};
function getData(req, res) {
  // const { page = 1, limit = 5 } = req.query;
  readFileData("./data.json", (err, data) => {
    if (err) {
      return sendResponse(res, 500, "Internal Server Error");
    }
    // const currentPage = parseInt(page);
    // const itemsPerPage = parseInt(limit);
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = currentPage * itemsPerPage;
    // const paginatedData = data.slice(startIndex, endIndex);
    // const response = {
    //   totalItems: data.length,
    //   totalPages: Math.ceil(data.length / itemsPerPage),
    //   currentPage,
    //   itemsPerPage,
    //   data: paginatedData,
    // };

    sendResponse(res, 200, "Data fetched successfully", data);
    // console.log(data);

    Logger.on("getdata", () => {
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
    let oUpdatedItem = JSON.parse(body);

    oUpdatedItem.dUpdatedAt = new Date().toLocaleString();

    readFileData("./data.json", (err, data) => {
      if (err) return sendResponse(res, 500, "Error reading data");

      const aItemIndex = data.findIndex((item) => item.iId === iId);

      if (aItemIndex === -1) {
        return sendResponse(res, 404, "Item not found");
      }
      Logger.log(`Item Deleted: ${JSON.stringify(oUpdatedItem)}`);

      data[aItemIndex] = { ...data[aItemIndex], ...oUpdatedItem };

      writeFileData("./data.json", data, (writeErr) => {
        if (writeErr) return sendResponse(res, 500, "Error updating data");
        sendResponse(res, 200, "Data updated successfully", data[aItemIndex]);
      });
      Logger.on("putdata", () => {
        console.log("updated data:", oUpdatedItem);
      });
      Logger.emit("putdata");
    });
  });
};

module.exports = { deleteData, getData, getDataId, postData, putData };

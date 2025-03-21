const fs = require("fs");
const url = require("url");
const logger = require("../EventHandler/eventLogger");

const putData = (req, res) => {
  const id = req.url.split("/")[3];

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  const validateData = (data) => {
    //validate data which is enter in post request
    let aKeys = Object.keys(data);
    let bool = false;
    aKeys.forEach((key) => {
      if (key !== "sName" && key !== "nQuantity" && key !== "nPrice") {
        bool = true;
      }
    });
    // console.log(aKeys);

    if (bool) {
      return "Enter valid keys";
    }
    const { sName, nQuantity, nPrice } = data;
    // console.log(typeof sName);
    // console.log(typeof nPrice);
    // console.log(typeof nQuantity);

    if (typeof sName !== "string") {
      return "name should be a string";
    }
    if (typeof nQuantity !== "number" || nQuantity <= 0) {
      return "quantity should be a number";
    }
    if (typeof nPrice !== "number" || nPrice <= 0) {
      return "price should be a number";
    }
    // if ((obj !== sName, nPrice, nQuantity)) {
    //   return "enter valid keys";
    // }

    return null;
  };

  req.on("end", () => {
    try {
      fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Error reading data" }));
          return;
        }

        let aJsonData = JSON.parse(data); //convert json data into array or object
        // console.log(aJsonData);

        let aItemIndex = aJsonData.findIndex((item) => item.id === id); //find the iteam of given id checking
        // console.log(aItemIndex);

        if (aItemIndex === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Item not found" }));
          return;
        }

        let oUpdatedItem = {
          ...aJsonData[aItemIndex], //spread existing data of json
          ...JSON.parse(body), //spread new data
          updatedAt: new Date(),
        };
        aJsonData[aItemIndex] = oUpdatedItem; //update array
        // console.log(oUpdatedItem);

        //copies of all jsondata with index and add into updated form

        const error = validateData(JSON.parse(body));

        if (error) {
          res.writeHead(400, { "content-type": "Application/json" });
          res.end(JSON.stringify({ message: error }));
          return;
        }

        fs.writeFile("./data.json", JSON.stringify(aJsonData), (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error updating data" }));
            return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Data updated successfully",
              oUpdatedItem,
            })
          );
        });
        logger.log(`Item Updated: ${JSON.stringify(oUpdatedItem)}`);
      });
    } catch (err) {
      res.end(err, { message: "Something went wrong!" });
    }
  });
};

module.exports = putData;

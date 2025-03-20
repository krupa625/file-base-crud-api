const fs = require("fs");
const url = require("url");

const putData = (req, res) => {
  const id = req.url.split("/")[3];

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  const validateData = (data) => {
    const { sName, nQuantity, nPrice } = data;
    if (sName !== "string") {
      return "name should be a string";
    }
    if (nQuantity !== Number || nQuantity <= 0) {
      return "quantity should be a number";
    }
    if (nPrice !== Number || nPrice <= 0) {
      return "price should be a number";
    }
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

        let jsonData = JSON.parse(data); //convert json data into array or object
        let itemIndex = jsonData.findIndex((item) => item.id === id); //find the iteam of given id checking

        if (itemIndex === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Item not found" }));
          return;
        }

        let updatedItem = {
          ...jsonData[itemIndex],
          ...JSON.parse(body),
          updatedAt: new Date(),
        };
        jsonData[itemIndex] = updatedItem;

        //copies of all jsondata with index and add into updated form

        const error = validateData(updatedItem);
        if (error) {
          res.writeHead(400, { "content-type": "Application/json" });
          res.end(JSON.stringify({ message: error }));
          return;
        }

        fs.writeFile("./data.json", JSON.stringify(jsonData), (err) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error updating data" }));
            return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Data updated successfully",
              updatedItem,
            })
          );
        });
      });
    } catch (err) {
      res.end(err, { message: "Something went wrong!" });
    }
  });
};

module.exports = putData;

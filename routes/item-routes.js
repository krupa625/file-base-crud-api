const router = require("../routes/helper");
const iteamController = require("../Controllers/item-controller");

router.get("/", iteamController.get);
router.get("/data", iteamController.getData);
router.post("/data/", iteamController.postData);
router.put("/data/:id", iteamController.putData);
router.delete("/data/:id", iteamController.deleteData);
router.get("/data/:id", iteamController.getDataId);

module.exports = router;

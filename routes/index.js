const iteamRoutes = require("./iteam-routes");
const router = require("../routes/helper");

router.use("/api", iteamRoutes);

module.exports = router;

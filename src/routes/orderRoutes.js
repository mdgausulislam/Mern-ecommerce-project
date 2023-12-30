const { addOrder, getOrders } = require("../controllers/OrderController");
const verifyToken = require("../middleware/verifyToken");
const verifyUser = require("../middleware/verifyUser");

const router = require("express").Router();

router.post("/addOrder", verifyToken, verifyUser, addOrder);
router.get("/getOrders", verifyToken, verifyUser, getOrders);
// router.post("/getOrder", requireSignin, userMiddleware, getOrder);

module.exports = router;
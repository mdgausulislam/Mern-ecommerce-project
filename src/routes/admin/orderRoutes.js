const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");
const { updateOrder, getCustomerOrders } = require("../../controllers/admin/orderPageControllers");
const router = express.Router();

router.post(`/order/update`, verifyToken, verifyAdmin, updateOrder);
router.post(
    `/order/getCustomerOrders`,
    verifyToken,
    verifyAdmin,
    getCustomerOrders
);

module.exports = router;
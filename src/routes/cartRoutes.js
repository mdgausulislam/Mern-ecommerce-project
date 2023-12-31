const express = require("express");
const router = express.Router();
const { addItemToCart, getCartItems, removeCartItems } = require("../controllers/cartControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyUser = require("../middleware/verifyUser");




router.post('/user/cart/addtocart', verifyToken, verifyUser, addItemToCart)
router.post("/user/getCartItems", verifyToken, verifyUser, getCartItems);
router.post("/user/cart/removeItem", verifyToken, verifyUser, removeCartItems);

module.exports = router;
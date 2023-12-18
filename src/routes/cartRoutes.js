const express = require("express");
const router = express.Router();
const { addItemToCart } = require("../controllers/cartControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyUser = require("../middleware/verifyUser");




router.post('/user/cart/addtocart', verifyToken, verifyUser, addItemToCart)
// router.get('/category/getcategory', getCategory)

module.exports = router;
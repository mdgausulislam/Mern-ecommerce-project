const express = require("express");
const router = express.Router();
const { CreateCategory, getCategory } = require("../controllers/categoryControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");



router.post('/category/create', verifyToken, verifyAdmin, CreateCategory)
router.get('/category/getcategory', getCategory)

module.exports = router;
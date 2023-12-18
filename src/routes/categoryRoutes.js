const express = require("express");
const router = express.Router();
const { CreateCategory, getCategory } = require("../controllers/categoryControllers");



router.post('/category/create', CreateCategory)
router.get('/category/getcategory', getCategory)

module.exports = router;
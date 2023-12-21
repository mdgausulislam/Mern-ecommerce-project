const express = require("express");
const { initialDataController } = require("../../controllers/admin/initialDataController");

const router = express.Router();


router.post('/initialdata', initialDataController);


module.exports = router;
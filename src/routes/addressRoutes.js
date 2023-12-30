const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const verifyUser = require('../middleware/verifyUser');
const { addAddress, getAddress } = require('../controllers/addressController');
const router = express.Router();


router.post('/user/address/create', verifyToken, verifyUser, addAddress);
router.post('/user/getaddress', verifyToken, verifyUser, getAddress);

module.exports = router;
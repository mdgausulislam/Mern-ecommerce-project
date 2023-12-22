const express = require("express");
const router = express.Router();
const { getCategory, addCategory } = require("../controllers/categoryControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = shortid.generate();
        const fileExtension = file.originalname.split('.').pop();
        const finalFilename = `${uniqueFilename}.${fileExtension}`;
        cb(null, finalFilename);
    }
});
const upload = multer({ storage: storage })

router.post('/category/create', verifyToken, verifyAdmin, upload.single('categoryImage'), addCategory)
router.get('/category/getcategory', getCategory)

module.exports = router;
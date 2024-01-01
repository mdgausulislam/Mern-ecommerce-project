const express = require("express");
const router = express.Router();
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');


const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const { CreateProduct, getProductDetailsById, getProductsBySlug, deleteProductById, getProducts } = require("../controllers/productController");

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



router.post('/product/create', verifyToken, verifyAdmin, upload.array('productPictures'), CreateProduct)
router.get("/product/:slug", getProductsBySlug);

router.get("/product/id/:productId", getProductDetailsById);

router.delete("/product/deleteProductById", verifyToken, verifyAdmin, deleteProductById);

router.post("/product/getProducts", verifyToken, verifyAdmin, getProducts);

module.exports = router;
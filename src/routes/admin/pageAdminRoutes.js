const express = require('express');
const verifyToken = require('../../middleware/verifyToken');
const verifyAdmin = require('../../middleware/verifyAdmin');
const { upload } = require('../../middleware/UploadFiles');
const { createPage, getPage } = require('../../controllers/admin/adminPageController');
const router = express.Router();

router.post(`/page/create`, verifyToken, verifyAdmin, upload.fields([
    { name: 'banners' },
    { name: 'products' }
]), createPage);
router.get(`/page/:category/:type`, getPage);

module.exports = router;
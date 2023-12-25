const express = require('express');
// const verifyToken = require('../../middleware/verifyToken');
// const verifyAdmin = require('../../middleware/verifyAdmin');
const { upload } = require('../../middleware/UploadFiles');
const { createPage } = require('../../controllers/admin/adminPageController');
const router = express.Router();

router.post(`/page/create`, upload.fields([
    { name: 'banners' },
    { name: 'products' }
]), createPage)

module.exports = router;
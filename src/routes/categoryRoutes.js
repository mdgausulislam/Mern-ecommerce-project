const express = require("express");
const Category = require("../models/categoryModel");
const router = express.Router();
const slugify = require('slugify'); // Import slugify

router.post('/category/create', async (req, res) => {
    const { name, slug, parentId } = req.body;

    const categoryObj = {
        name,
        slug: slugify(name)
    }
    if (parentId) {
        categoryObj.parentId = parentId
    }
    const newCategory = new Category(categoryObj);
    const saveCategory = await newCategory.save();
    res.status(201).json({ Category: saveCategory })
})

module.exports = router;
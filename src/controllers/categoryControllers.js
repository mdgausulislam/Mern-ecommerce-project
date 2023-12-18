const Category = require("../models/categoryModel");
const slugify = require('slugify');

const CreateCategory = async (req, res) => {
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
}


const getCategory = async (req, res) => {
    const categories = await Category.find({})
    res.status(200).json({ categories })
}



module.exports = { CreateCategory, getCategory }
const Category = require("../models/categoryModel");
const slugify = require('slugify');
const shortid = require("shortid");

const createCategories = (categories, parentId = null) => {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined)
    } else {
        category = categories.filter((cat) => cat.parentId == parentId)
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id)
        });
    }
    return categoryList;
}


const addCategory = async (req, res) => {
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        createdBy: req.user._id,
    };

    if (req.file) {
        categoryObj.categoryImage = process.env.API + "/public/" + req.file.filename;
    }

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }
    console.log("Parent ID:", categoryObj.parentId); // Check the parent ID

    const newCategory = new Category(categoryObj);

    const saveCategory = await newCategory.save();
    res.status(201).json({ Category: saveCategory });
}


const getCategory = async (req, res) => {
    const categories = await Category.find({})

    const categoryList = createCategories(categories)
    res.status(200).json({ categoryList })
}

module.exports = { createCategories, addCategory, getCategory }
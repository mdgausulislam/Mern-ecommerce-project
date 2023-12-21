const Category = require("../models/categoryModel");
const slugify = require('slugify');
const shortid = require("shortid");

const CreateCategory = async (req, res) => {

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
    console.log(req.body.parentId);

    const newCategory = new Category(categoryObj);
    const saveCategory = await newCategory.save();
    res.status(201).json({ Category: saveCategory })
}


function createCategories(categories, parentId = null) {
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
            children: createCategories(categories, cate._id)
        });
    }
    return categoryList;
}

const getCategory = async (req, res) => {
    const categories = await Category.find({})

    const categoryList = createCategories(categories)
    res.status(200).json({ categoryList })
}



module.exports = { CreateCategory, getCategory }
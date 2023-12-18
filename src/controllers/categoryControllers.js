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


function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined)
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }
    return categoryList;
}

const getCategory = async (req, res) => {
    const categories = await Category.find({})

    const categoryList = createCategories(categories)
    res.status(200).json({ categoryList })
}



module.exports = { CreateCategory, getCategory }
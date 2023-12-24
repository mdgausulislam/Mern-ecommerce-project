const Category = require("../models/categoryModel");
const slugify = require('slugify');
const shortid = require("shortid");

function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;

    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id),
        });
    }

    return categoryList;
}

exports.addCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        let categoryImage = '';

        if (req.file) {
            categoryImage = process.env.API + "/public/" + req.file.filename;
        }

        const categoryObj = {
            name,
            slug: `${slugify(name)}-${shortid.generate()}`,
            createdBy: req.user._id,
            categoryImage,
        };

        if (parentId) {
            categoryObj.parentId = parentId;
        }

        const cat = new Category(categoryObj);
        const category = await cat.save();

        res.status(201).json({ category });
    } catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred while creating the category' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).exec();

        if (!categories || categories.length === 0) {
            return res.status(404).json({ error: 'Categories not found' });
        }

        const categoryList = createCategories(categories);
        res.status(200).json({ categoryList });
    } catch (error) {
        res.status(400).json({ error: error.message || 'An error occurred while fetching categories' });
    }
};


exports.updateCategories = async (req, res) => {
    const { _id, name, parentId, type } = req.body;
    const updatedCategories = [];
    if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
            const category = {
                name: name[i],
                type: type[i],
            };
            if (parentId[i] !== "") {
                category.parentId = parentId[i];
            }
            const updatedCategory = await Category.findOneAndUpdate({ _id: _id[i] }, category, {
                new: true
            });
            updatedCategories.push(updatedCategory);

        }
        return res.status(201).json({ updatedCategories: updatedCategories })
    } else {
        const category = {
            name,
            type
        };
        if (parentId !== "") {
            category.parentId = parentId[i];
        }
        const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
            new: true
        });
        return res.status(201).json({ updatedCategory })

    }

}

exports.deleteCategories = async (req, res) => {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for (let i = 0; i < ids.length; i++) {
        const deleteCategory = await Category.findOneAndDelete({
            _id: ids[i]._id,
            // createdBy: req.user._id,
        });
        deletedCategories.push(deleteCategory);
    }

    if (deletedCategories.length == ids.length) {
        res.status(201).json({ message: "Categories removed" });
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
};
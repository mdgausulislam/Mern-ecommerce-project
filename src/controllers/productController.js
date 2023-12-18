
const slugify = require('slugify');
const Product = require('../models/productModel');
// const multer = require('multer')
// const shortid = require('shortid');
// const slugify = require('slugify');

const CreateProduct = async (req, res) => {

    // res.status(200).json({ file: req.files, body: req.body })
    const { name, price, description, category, createdBy, quantity } = req.body;

    let productPicture = [];
    if (req.files.length > 0) {
        productPicture = req.files.map(file => {
            return { img: file.filename };
        })
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        description,
        productPicture,
        category,
        createdBy: req.user._id,
        quantity,
    })
    const savedProduct = await product.save();
    res.status(201).json({ product: savedProduct });
}


// function createCategories(categories, parentId = null) {
//     const categoryList = [];
//     let category;
//     if (parentId == null) {
//         category = categories.filter(cat => cat.parentId == undefined)
//     } else {
//         category = categories.filter(cat => cat.parentId == parentId)
//     }

//     for (let cate of category) {
//         categoryList.push({
//             _id: cate._id,
//             name: cate.name,
//             slug: cate.slug,
//             children: createCategories(categories, cate._id)
//         })
//     }
//     return categoryList;
// }

// const getCategory = async (req, res) => {
//     const categories = await Category.find({})

//     const categoryList = createCategories(categories)
//     res.status(200).json({ categoryList })
// }



module.exports = { CreateProduct }
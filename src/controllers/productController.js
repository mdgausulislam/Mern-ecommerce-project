
const slugify = require('slugify');
const Product = require('../models/productModel');

const CreateProduct = async (req, res) => {

    const { name, price, description, category, createdBy, quantity } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename };
        })
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        description,
        productPictures,
        category,
        createdBy: req.user._id,
        quantity,
    })
    const savedProduct = await product.save();
    res.status(201).json({ product: savedProduct });
}



module.exports = { CreateProduct }
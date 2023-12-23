const slugify = require('slugify');
const Product = require('../models/productModel');

const CreateProduct = async (req, res) => {
    const { name, price, description, category, quantity, createdBy } = req.body;
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.location };
        });
    }

    try {
        const product = new Product({
            name: name,
            slug: slugify(name),
            price,
            quantity,
            description,
            productPictures,
            category,
            createdBy: req.user._id,
        });

        const savedProduct = await product.save();
        if (savedProduct) {
            res.status(201).json({ product: savedProduct, files: req.files });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getProductsBySlug = async (req, res) => {
    const { slug } = req.params;

    res.status(200).json({ slug });
};




module.exports = { CreateProduct, getProductsBySlug }
const slugify = require('slugify');
const Product = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

const CreateProduct = async (req, res) => {
    const { name, price, description, category, quantity, createdBy } = req.body;
    let productPictures = [];

    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename };
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
            const updatedProduct = await Product.findById(savedProduct._id)
                .populate('productPictures', 'img')
                .exec();

            res.status(201).json({ product: updatedProduct, files: req.files });
        } else {
            res.status(500).json({ error: 'Failed to save product' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getProductsBySlug = async (req, res) => {

    const { slug } = req.params;
    // console.log("Received slug:", slug);

    const category = await categoryModel.findOne({ slug: { $regex: new RegExp(slug, 'i') } }).select('_id').exec();
    // console.log("Retrieved category:", category);

    if (!category) {
        // console.log("Category not found");
        return res.status(404).json({ error: "Category not found" });
    }

    let products = await Product.find({ category: category._id }).exec();

    if (products.length > 0) {
        const productByPrice = {
            under5k: products.filter(product => product.price <= 5000),
            under10k: products.filter(product => product.price > 5000 && product.price <= 10000),
            under15k: products.filter(product => product.price > 10000 && product.price <= 15000),
            under20k: products.filter(product => product.price > 15000 && product.price <= 20000),
            under30k: products.filter(product => product.price > 20000 && product.price <= 30000),
        };
        const priceRange = {
            under5k: 5000,
            under10k: 10000,
            under15k: 15000,
            under20k: 20000,
            under30k: 30000,
        };

        // const productByPrice = {
        //     under10k: products.filter(product => product.price <= 10000),
        //     under20k: products.filter(product => product.price > 10000 && product.price <= 20000),
        //     under30k: products.filter(product => product.price > 20000 && product.price <= 30000),
        //     under40k: products.filter(product => product.price > 30000 && product.price <= 40000),
        //     under50k: products.filter(product => product.price > 40000 && product.price <= 50000),
        // };
        // const priceRange = {
        //     under10k: 10000,
        //     under20k: 20000,
        //     under30k: 30000,
        //     under40k: 40000,
        //     under50k: 50000,
        // };

        res.status(200).json({
            products,
            priceRange,
            productByPrice,

        });
    } else {
        res.status(200).json({ products: [], productByPrice: {} });
    }
};


const getProductDetailsById = async (req, res) => {
    const { productId } = req.params;
    if (productId) {
        try {
            const product = await Product.findOne({ _id: productId }).exec();

            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
            res.status(200).json({ product });
        } catch (error) {
            return res.status(400).json({ error });
        }
    } else {
        return res.status(400).json({ error: "Params required" });
    }
};


const deleteProductById = async (req, res) => {
    const { productId } = req.body.payload;
    if (productId) {
        try {
            const result = await Product.deleteOne({ _id: productId }).exec();
            res.status(202).json({ result });
        } catch (error) {
            res.status(400).json({ error });
        }
    } else {
        res.status(400).json({ error: "Params required" });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ createdBy: req.user._id })
            .select("_id name price quantity slug description productPictures category")
            .populate({ path: "category", select: "_id name" })
            .exec();

        res.status(200).json({ products });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = { CreateProduct, getProductsBySlug, getProductDetailsById, deleteProductById, getProducts }
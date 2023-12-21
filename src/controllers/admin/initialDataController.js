const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");

const initialDataController = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).exec();
        console.log(categories); // Logging the retrieved categories
        const products = await productModel.find({}).exec();
        console.log(products); // Logging the retrieved products
        res.status(200).json({
            categories,
            products,
        });
    } catch (error) {
        // Handle errors here
        res.status(500).json({ error: error.message });
    }
};

module.exports = { initialDataController };

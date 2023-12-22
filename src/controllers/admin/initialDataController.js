const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");


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

const initialDataController = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).exec();
        console.log(categories); // Logging the retrieved categories
        const products = await productModel.find({})
            .select('_id name price quantity slug description productPictures category')
            .populate({ path: 'category', select: '_id name' })
            .exec();
        console.log(products); // Logging the retrieved products
        res.status(200).json({
            categories: createCategories(categories),
            products,
        });
    } catch (error) {
        // Handle errors here
        res.status(500).json({ error: error.message });
    }
};

module.exports = { initialDataController };

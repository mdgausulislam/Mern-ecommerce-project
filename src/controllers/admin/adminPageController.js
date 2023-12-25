// const Page = require("../../models/pageModel");

// const createPage = (req, res) => {
//     const { banners, products } = req.files;
//     if (banners && banners.length > 0) {
//         req.body.banners = banners.map((banner, index) => ({
//          img: `${process.env.API}/public/${banner.filename}`,
//             navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
//         }));
//     }
//     if (products && products.length > 0) {
//         req.body.products = products.map((product, index) => ({
//             img: `/public/${product.filename}`,
//             navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
//         }));
//     }

//     req.body.createdBy = req.user._id;

//     Page.findOne({ category: req.body.category }).exec((error, page) => {
//         if (error) return res.status(400).json({ error });
//         if (page) {
//             Page.findOneAndUpdate({ category: req.body.category }, req.body).exec(
//                 (error, updatedPage) => {
//                     if (error) return res.status(400).json({ error });
//                     if (updatedPage) {
//                         return res.status(201).json({ page: updatedPage });
//                     }
//                 }
//             );
//         } else {
//             const page = new Page(req.body);

//             page.save((error, page) => {
//                 if (error) return res.status(400).json({ error });
//                 if (page) {
//                     return res.status(201).json({ page });
//                 }
//             });
//         }
//     });
// };

// module.exports = { createPage };


const Page = require("../../models/pageModel");

const createPage = async (req, res) => {
    const { banners, products } = req.files;

    if (banners && banners.length > 0) {
        req.body.banners = banners.map((banner) => ({
            img: `${process.env.API}/public/${banner.filename}`,
            navigateTo: `/bannerClicked?categoryId=${req.body.category}&type=${req.body.type}`,
        }));
    }
    if (products && products.length > 0) {
        req.body.products = products.map((product) => ({
            img: `/public/${product.filename}`,
            navigateTo: `/productClicked?categoryId=${req.body.category}&type=${req.body.type}`,
        }));
    }

    res.status(200).json({ body: req.body })

    //     req.body.createdBy = req.user._id;

    //     let page = await Page.findOne({ category: req.body.category });

    //     if (page) {
    //         page = await Page.findOneAndUpdate({ category: req.body.category }, req.body, { new: true });
    //         return res.status(201).json({ page: updatedPage });
    //     } else {
    //         page = new Page(req.body);
    //         await page.save();
    //         return res.status(201).json({ page });
    //     }
    // } catch (error) {
    //     return res.status(400).json({ error: error.message });
    // }
};

module.exports = { createPage };

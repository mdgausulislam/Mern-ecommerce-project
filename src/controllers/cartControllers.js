const Cart = require('../models/cartModel');

function runUpdate(condition, updateData) {
    return Cart.findOneAndUpdate(condition, updateData, { upsert: true }).exec();
}

const addItemToCart = async (req, res) => {
    try {

        const existingCart = await Cart.findOne({ user: req.user._id });

        if (existingCart) {
            // If cart exists for the user, update the cart items
            const promiseArray = [];

            for (const cartItem of req.body.cartItems) {
                const product = cartItem.product;
                const item = existingCart.cartItems.find(c => c.product == product);
                let condition, update;

                if (item) {
                    condition = { user: req.user._id, "cartItems.product": product };
                    update = {
                        $set: {
                            "cartItems.$.quantity": item.quantity + cartItem.quantity
                        }
                    };
                } else {
                    update = {
                        $push: {
                            cartItems: cartItem
                        }
                    };
                }

                const promise = runUpdate(condition, update);
                promiseArray.push(promise);
            }

            // Wait for all update operations to complete
            const responses = await Promise.all(promiseArray);
            return res.status(201).json({ response: responses });
        } else {
            // If cart does not exist, create a new cart for the user
            const newCart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems,
            });

            const savedCart = await newCart.save();
            return res.status(201).json({ cart: savedCart });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



const getCartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate("cartItems.product", "_id name price productPictures")
            .exec();

        if (cart) {
            let cartItems = {};
            cart.cartItems.forEach((item, index) => {
                cartItems[item.product._id.toString()] = {
                    _id: item.product._id.toString(),
                    name: item.product.name,
                    img: item.product.productPictures[0].img,
                    price: item.product.price,
                    qty: item.quantity,
                };
            });
            res.status(200).json({ cartItems });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { addItemToCart, getCartItems };












// const addItemToCart = async (req, res) => {
//     try {
//         const existingCart = await Cart.findOne({ user: req.user._id });

//         if (existingCart) {
//             // If cart exists for the user, update the cart items
//             let promiseArray = [];

//             req.body.cartItems.forEach((cartItem) => {
//                 const product = cartItem.product;
//                 const item = existingCart.cartItems.find(c => c.product == product);

//                 if (item) {
//                     await Cart.findOneAndUpdate(
//                         { user: req.user._id, "cartItems.product": product },
//                         {
//                             $set: {
//                                 "cartItems.$.quantity": item.quantity + req.body.cartItems.quantity
//                             }
//                         }
//                     );
//                 } else {
//                     await Cart.findOneAndUpdate(
//                         { user: req.user._id },
//                         {
//                             $push: {
//                                 cartItems: req.body.cartItems
//                             }
//                         }
//                     );
//                 }
//                 promiseArray.push(runUpdate(condition, update));
//             })
//             await Promise.all(promiseArray);
//             // const updatedCart = await Cart.findOne({ user: req.user._id });
//             return res.status(200).json({ cart: promiseArray });

//         } else {
//             // If cart does not exist, create a new cart for the user
//             const newCart = new Cart({
//                 user: req.user._id,
//                 cartItems: [req.body.cartItems],
//             });

//             const savedCart = await newCart.save();
//             return res.status(201).json({ cart: savedCart });
//         }
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// module.exports = { addItemToCart };


// exports.addItemToCart = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user._id });

//         if (cart) {
//             let promiseArray = [];

//             req.body.cartItems.forEach((cartItem) => {
//                 const product = cartItem.product;
//                 const item = cart.cartItems.find((c) => c.product == product);
//                 let condition, update;
//                 if (item) {
//                     condition = { user: req.user._id, "cartItems.product": product };
//                     update = {
//                         $set: {
//                             "cartItems.$": cartItem,
//                         },
//                     };
//                 } else {
//                     condition = { user: req.user._id };
//                     update = {
//                         $push: {
//                             cartItems: cartItem,
//                         },
//                     };
//                 }
//                 promiseArray.push(runUpdate(condition, update));
//             });

//             await Promise.all(promiseArray);
//             return res.status(201).json({ message: 'Cart updated successfully' });
//         } else {
//             const newCart = new Cart({
//                 user: req.user._id,
//                 cartItems: req.body.cartItems,
//             });
//             const savedCart = await newCart.save();
//             return res.status(201).json({ cart: savedCart });
//         }
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };



// exports.getCartItems = (req, res) => {
//     //const { user } = req.body.payload;
//     //if(user){
//     Cart.findOne({ user: req.user._id })
//         .populate("cartItems.product", "_id name price productPictures")
//         .exec((error, cart) => {
//             if (error) return res.status(400).json({ error });
//             if (cart) {
//                 let cartItems = {};
//                 cart.cartItems.forEach((item, index) => {
//                     cartItems[item.product._id.toString()] = {
//                         _id: item.product._id.toString(),
//                         name: item.product.name,
//                         img: item.product.productPictures[0].img,
//                         price: item.product.price,
//                         qty: item.quantity,
//                     };
//                 });
//                 res.status(200).json({ cartItems });
//             }
//         });
//     //}
// };






// const addItemToCart = async (req, res) => {
//     try {
//         const existingCart = await Cart.findOne({ user: req.user._id });

//         if (existingCart) {
//             // If cart exists for the user, update the cart items

//             const product = req.body.cartItems.product;
//             const item = existingCart.cartItems.find(c => c.product == product);

//             if (item) {
//                 await Cart.findOneAndUpdate(
//                     { user: req.user._id, "cartItems.product": product },
//                     {
//                         $set: {
//                             "cartItems.$.quantity": item.quantity + req.body.cartItems.quantity
//                         }
//                     }
//                 );
//             } else {
//                 await Cart.findOneAndUpdate(
//                     { user: req.user._id },
//                     {
//                         $push: {
//                             cartItems: req.body.cartItems
//                         }
//                     }
//                 );
//             }

//             const updatedCart = await Cart.findOne({ user: req.user._id });
//             return res.status(200).json({ cart: updatedCart });

//         } else {
//             // If cart does not exist, create a new cart for the user
//             const newCart = new Cart({
//                 user: req.user._id,
//                 cartItems: [req.body.cartItems],
//             });

//             const savedCart = await newCart.save();
//             return res.status(201).json({ cart: savedCart });
//         }
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// module.exports = { addItemToCart };







// const Cart = require('../models/cartModel');

// const addItemToCart = async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ user: req.user._id });

//         if (cart) {
//             let promiseArray = [];

//             req.body.cartItems.forEach((cartItem) => {
//                 const product = cartItem.product;
//                 const item = cart.cartItems.find((c) => c.product == product);
//                 let condition, update;
//                 if (item) {
//                     condition = { user: req.user._id, "cartItems.product": product };
//                     update = {
//                         $set: {
//                             "cartItems.$": cartItem,
//                         },
//                     };
//                 } else {
//                     condition = { user: req.user._id };
//                     update = {
//                         $push: {
//                             cartItems: cartItem,
//                         },
//                     };
//                 }
//                 promiseArray.push(Cart.updateOne(condition, update));
//             });

//             await Promise.all(promiseArray);
//             const updatedCart = await Cart.findOne({ user: req.user._id });
//             return res.status(201).json({ cart: updatedCart });
//         } else {
//             const newCart = new Cart({
//                 user: req.user._id,
//                 cartItems: req.body.cartItems,
//             });
//             const savedCart = await newCart.save();
//             return res.status(201).json({ cart: savedCart });
//         }
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// };

// module.exports = { addItemToCart };

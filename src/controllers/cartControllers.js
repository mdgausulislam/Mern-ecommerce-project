const Cart = require('../models/cartModel');

const addItemToCart = async (req, res) => {
    try {
        const existingCart = await Cart.findOne({ user: req.user._id });

        if (existingCart) {
            // If cart exists for the user, update the cart items

            const product = req.body.cartItems.product;
            const item = existingCart.cartItems.find(c => c.product == product);

            if (item) {
                await Cart.findOneAndUpdate(
                    { user: req.user._id, "cartItems.product": product },
                    {
                        $set: {
                            "cartItems.$.quantity": item.quantity + req.body.cartItems.quantity
                        }
                    }
                );
            } else {
                await Cart.findOneAndUpdate(
                    { user: req.user._id },
                    {
                        $push: {
                            cartItems: req.body.cartItems
                        }
                    }
                );
            }

            const updatedCart = await Cart.findOne({ user: req.user._id });
            return res.status(200).json({ cart: updatedCart });

        } else {
            // If cart does not exist, create a new cart for the user
            const newCart = new Cart({
                user: req.user._id,
                cartItems: [req.body.cartItems],
            });

            const savedCart = await newCart.save();
            return res.status(201).json({ cart: savedCart });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { addItemToCart };




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

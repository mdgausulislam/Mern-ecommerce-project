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


const removeCartItems = async (req, res) => {
    try {
        const { productId } = req.body.payload;
        if (productId) {
            const result = await Cart.updateOne(
                { user: req.user._id },
                {
                    $pull: {
                        cartItems: {
                            product: productId,
                        },
                    },
                }
            ).exec();

            if (result) {
                res.status(202).json({ result });
            }
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};



module.exports = { addItemToCart, getCartItems, removeCartItems };





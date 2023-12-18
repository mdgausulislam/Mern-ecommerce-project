const Cart = require('../models/cartModel');

const addItemToCart = async (req, res) => {
    try {
        const existingCart = await Cart.findOne({ user: req.user._id });

        if (existingCart) {
            const product = req.body.cartItems.product;
            const item = existingCart.cartItems.find(c => c.product === product);

            if (item) {
                // If item already exists in cart, update the quantity
                item.quantity += req.body.cartItems.quantity;
            } else {
                // If item does not exist in cart, add it to the cartItems array
                existingCart.cartItems.push(req.body.cartItems);
            }

            // Save the updated cart
            const updatedCart = await existingCart.save();
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

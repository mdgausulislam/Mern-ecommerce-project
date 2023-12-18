
const Cart = require('../models/cartModel');

const addItemToCart = async (req, res) => {
    //    return res.status(200).json({ message: 'cart' })

    const cart = new Cart({
        user: req.user._id,
        cartItems: req.body.cartItems,

    })

    const newCartItem = new Cart(cart);
    const saveCartItem = await newCartItem.save();
    res.status(201).json({ cart: saveCartItem })

}


module.exports = { addItemToCart }
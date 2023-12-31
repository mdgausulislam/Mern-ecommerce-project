const Order = require("../../models/orderModel");

exports.updateOrder = async (req, res) => {
    console.log("orderId:", req.body.orderId);
    console.log("order type:", req.body.type);
    try {
        const order = await Order.updateOne(
            { _id: req.body.orderId, "orderStatus.type": req.body.type },
            {
                $set: {
                    "orderStatus.$.isCompleted": true,
                    "orderStatus.$.date": new Date(),
                },
            }
        );

        if (order) {
            res.status(201).json({ order });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.getCustomerOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("items.productId", "name");
        res.status(200).json({ orders });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

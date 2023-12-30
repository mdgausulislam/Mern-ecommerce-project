const cartModel = require("../models/cartModel");
const order = require("../models/orderModel");

exports.addOrder = async (req, res) => {
  try {
    await cartModel.deleteOne({ user: req.user._id });

    req.body.user = req.user._id;
    req.body.orderStatus = [
      {
        type: "ordered",
        date: new Date(),
        isCompleted: true,
      },
      {
        type: "packed",
        isCompleted: false,
      },
      {
        type: "shipped",
        isCompleted: false,
      },
      {
        type: "delivered",
        isCompleted: false,
      },
    ];

    const order = new orderModel(req.body);
    const savedOrder = await order.save();

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




exports.getOrders = async (req, res) => {
    try {
      const orders = await order.find({ user: req.user._id })
        .select("_id paymentStatus paymentType orderStatus items")
        .populate("items.productId", "_id name productPictures")
        .exec();
  
      if (orders && orders.length > 0) {
        res.status(200).json({ orders });
      } else {
        res.status(404).json({ message: "No orders found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  
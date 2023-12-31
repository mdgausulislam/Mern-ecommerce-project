const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");
const Address = require("../models/addressModel");

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
    const orders = await orderModel.find({ user: req.user._id })
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


// exports.getOrder = async (req, res) => {
//   try {
//     const order = await orderModel.findOne({ _id: req.body.orderId })
//       .populate("items.productId", "_id name productPictures")
//       .lean()
//       .exec();

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     const address = await Address.findOne({ user: req.user._id }).exec();

//     if (!address) {
//       return res.status(404).json({ error: "Address not found" });
//     }

//     orderModel.address = address.address.find(
//       (adr) => adr._id.toString() === order.addressId.toString()
//     );

//     res.status(200).json({ order });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };



exports.getOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId; // Retrieve orderId from request body
    const order = await orderModel.findOne({ _id: orderId })
      .populate("items.productId", "_id name productPictures")
      .lean()
      .exec();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const address = await Address.findOne({ user: req.user._id }).exec();

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    order.address = address.address.find(
      (adr) => adr._id.toString() === order.addressId.toString()
    );

    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


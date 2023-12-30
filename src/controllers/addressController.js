const UserAddress = require("../models/addressModel");

exports.addAddress = async (req, res) => {
    const { payload } = req.body;
    try {
        if (!payload.address) {
            return res.status(400).json({ error: "Params address required" });
        }

        let address;
        if (payload.address._id) {
            address = await UserAddress.findOneAndUpdate(
                { user: req.user._id, "address._id": payload.address._id },
                {
                    $set: {
                        "address.$": payload.address,
                    },
                },
                { new: true }
            );
        } else {
            address = await UserAddress.findOneAndUpdate(
                { user: req.user._id },
                {
                    $push: {
                        address: payload.address,
                    },
                },
                { new: true, upsert: true }
            );
        }

        if (address) {
            return res.status(201).json({ address });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

exports.getAddress = async (req, res) => {
    try {
        const userAddress = await UserAddress.findOne({ user: req.user._id });
        if (userAddress) {
            return res.status(200).json({ userAddress });
        }
        return res.status(404).json({ error: "Address not found" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};




















// const UserAddress = require("../models/addressModel");

// exports.addAddress = (req, res) => {
//     const { payload } = req.body;
//     if (payload.address) {
//         if (payload.address._id) {
//             UserAddress.findOneAndUpdate(
//                 { user: req.user._id, "address._id": payload.address._id },
//                 {
//                     $set: {
//                         "address.$": payload.address,
//                     },
//                 }
//             ).exec((error, address) => {
//                 if (error) return res.status(400).json({ error });
//                 if (address) {
//                     res.status(201).json({ address });
//                 }
//             });
//         } else {
//             UserAddress.findOneAndUpdate(
//                 { user: req.user._id },
//                 {
//                     $push: {
//                         address: payload.address,
//                     },
//                 },
//                 { new: true, upsert: true }
//             ).exec((error, address) => {
//                 if (error) return res.status(400).json({ error });
//                 if (address) {
//                     res.status(201).json({ address });
//                 }
//             });
//         }
//     } else {
//         res.status(400).json({ error: "Params address required" });
//     }
// };

// exports.getAddress = (req, res) => {
//     UserAddress.findOne({ user: req.user._id }).exec((error, userAddress) => {
//         if (error) return res.status(400).json({ error });
//         if (userAddress) {
//             res.status(200).json({ userAddress });
//         }
//     });
// };
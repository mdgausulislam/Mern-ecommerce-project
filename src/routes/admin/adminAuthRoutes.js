const express = require("express");

const verifyToken = require("../../utlities/verifyToken");
const { signUp, signin } = require("../../controllers/admin/adminAuthControllers");
const router = express.Router();


router.post('/admin/signup', signUp);

router.post('/admin/signin', signin);


// router.post('/profile', verifyToken, async (req, res) => {
//     res.status(200).json({ user: "profile" })
// })


module.exports = router;
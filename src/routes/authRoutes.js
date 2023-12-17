const express = require("express");
const { signUp, signin } = require("../controllers/authControler");
const verifyToken = require("../utlities/verifyToken");
const router = express.Router();


router.post('/signup', signUp);

router.post('/signin', signin);


router.post('/profile', verifyToken, async (req, res) => {
    res.status(200).json({ user: "profile" })
})


module.exports = router;
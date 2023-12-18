const express = require("express");
const { signUp, signin } = require("../controllers/authControler");
const verifyToken = require("../middleware/verifyToken");
const { validationSignupRequest, isRequestValided, validationSigninRequest } = require("../Validation/authValidation");

const router = express.Router();


router.post('/signup', validationSignupRequest, isRequestValided, signUp);

router.post('/signin', validationSigninRequest, isRequestValided, signin);


router.post('/profile', verifyToken, async (req, res) => {
    res.status(200).json({ user: "profile" })
})


module.exports = router;
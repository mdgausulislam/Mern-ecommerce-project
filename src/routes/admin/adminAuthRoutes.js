const express = require("express");

// const verifyToken = require("../../utlities/verifyToken");
const { signUp, signin } = require("../../controllers/admin/adminAuthControllers");
const { validationSignupRequest, validationSigninRequest, isRequestValided } = require("../../Validation/authValidation");

const router = express.Router();


router.post('/admin/signup', validationSignupRequest, isRequestValided, signUp);

router.post('/admin/signin', validationSigninRequest, isRequestValided, signin);


// router.post('/profile', verifyToken, async (req, res) => {
//     res.status(200).json({ user: "profile" })
// })


module.exports = router;
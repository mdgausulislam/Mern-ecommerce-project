const express = require("express");
const { signUp, signin, signout } = require("../../controllers/admin/adminAuthControllers");
const { validationSignupRequest, validationSigninRequest, isRequestValided } = require("../../Validation/authValidation");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();


router.post('/admin/signup', validationSignupRequest, isRequestValided, signUp);
router.post('/admin/signin', validationSigninRequest, isRequestValided, signin);
router.post('/admin/signout', signout);



module.exports = router;
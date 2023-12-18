const { check, validationResult } = require("express-validator");

const validationSignupRequest = [
    check('firstName')
        .notEmpty()
        .withMessage('firstname is required'),
    check('lastName')
        .notEmpty()
        .withMessage('lastname is required'),
    check('email')
        .isEmail()
        .withMessage('validEmail is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
]
const validationSigninRequest = [
    check('email')
        .isEmail()
        .withMessage('validEmail is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
]


const isRequestValided = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}
module.exports = {
    validationSignupRequest,
    validationSigninRequest,
    isRequestValided
};


const express = require("express");
const { signUp } = require("../controllers/userControler");
const router = express.Router();


// router.post('/signup', (req, res) => {
//     user.findOne({ email: req.body.email })
//         .exec((error, user) => {
//             if (user) return res.status(400).json({
//                 message: "user already register"
//             });

//             const {
//                 firstName,
//                 lastName,
//                 email,
//                 pasword
//             } = req.body

//             const _user = new user({ firstName, lastName, username: Math.random().toString(), email, pasword })
//             _user.save((error, data) => {
//                 if (error) {
//                     return res.status(400).json({
//                         message: "something went wrong"
//                     })
//                 }

//                 if (data) {
//                     return res.status(201).json({
//                         user: data
//                     })
//                 }
//             })
//         })
// })


router.post('/signup',signUp );

router.post('/signin', (req, res) => {

})


module.exports = router;
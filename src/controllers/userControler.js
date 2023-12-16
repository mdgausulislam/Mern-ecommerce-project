const user = require("../models/userModels");
const signUp = async (req, res) => {
    try {
        const existingUser = await user.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const {
            firstName,
            lastName,
            email,
            password // Corrected 'pasword' typo to 'password'
        } = req.body;

        const newUser = new user({ firstName, lastName, username: Math.random().toString(), email, hash_password: password });
        const savedUser = await newUser.save();

        if (savedUser) {
            return res.status(201).json({ message: "user created successfully" });
        }
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { signUp }
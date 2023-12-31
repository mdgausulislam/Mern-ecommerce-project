const User = require("../models/userModels");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const shortid = require('shortid');

const generateJwtToken = (_id, role) => {
    return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "user already registered" })
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    const newUser = new User({ firstName, lastName, username: shortid.generate(), email, password: hashedPassword })
    const savedUser = await newUser.save();
    if (savedUser) {
        const token = generateJwtToken(savedUser._id, savedUser.role);
        return res.status(201).json({ message: "user created successfully", token });
    }
}


const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
        return res.status(400).json({ message: "invalid password" })
    }

    const token = generateJwtToken(user._id, user.role);

    if (user.role !== 'user') {
        return res.status(403).json({ message: "Access denied. Not a user." });
    }

    return res.status(200).json({
        token,
        user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }
    });
}

module.exports = { signUp, signin };

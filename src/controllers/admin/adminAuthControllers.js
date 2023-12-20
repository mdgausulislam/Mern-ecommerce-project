const User = require("../../models/userModels");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Admin already registered" })
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, role: "admin" })
    const savedUser = await newUser.save();
    if (savedUser) {
        return res.status(201).json({ message: "Admin create successfully" });
    }
}


const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
        return res.status(400).json({ message: "Admin not found" })
    }
    const validPasword = bcrypt.compareSync(password, user.password);
    console.log(validPasword);
    if (!validPasword) {
        return res.status(400).json({ mesasge: "Admin invalid password" })
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" })

    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Not an admin." });
    }
    res.cookie('token', token, { expiresIn: '1h' })
    return res.status(200).json({ token, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });

}

const signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "signout successfully...!" })
}



module.exports = { signUp, signin, signout }
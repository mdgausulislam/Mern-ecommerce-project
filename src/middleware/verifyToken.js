const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    // console.log("inside verify token", req.headers.authorization);
    // next();
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "unauthorized access" })
    }

    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "unauthorized access" })
        }
        req.user = user;
        next();
    })
}
module.exports = verifyToken;
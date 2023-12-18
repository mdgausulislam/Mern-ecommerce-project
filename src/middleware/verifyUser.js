const verifyUser = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(400).json({ message: "User Access denied" })
    }
    next();
}
module.exports = verifyUser;
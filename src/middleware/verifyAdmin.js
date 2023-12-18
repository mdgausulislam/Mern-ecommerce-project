const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: "Access denied. Not an Admin" })
    }
    next();
}
module.exports = verifyAdmin;
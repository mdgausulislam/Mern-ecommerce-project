const express = require("express");
const env = require("dotenv");
const app = express();

const mongoose = require('mongoose');

// Environment setup
env.config();

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.yrorxmn.mongodb.net/${process.env.MONGODB_DATABASE_URL}?retryWrites=true&w=majority`)
    .then(() => console.log('Database connected!'))
    .catch((err) => console.error('Database connection error:', err));

console.log(process.env.MONGODB_DATABASE_URL);

// Middleware to parse incoming request bodies
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Server is Working"
    });
});

app.post("/data", (req, res, next) => {
    res.status(200).json({
        message: req.body
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`MERN e-commerce project server port: ${port}`);
});

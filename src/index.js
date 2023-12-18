const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require('mongoose');
const AuthRouter = require("./routes/authRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const adminRouter = require("./routes/admin/adminAuthRoutes");
const productRouter = require("./routes/productsRoutes");
// Environment setup
env.config();


// Connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.yrorxmn.mongodb.net/${process.env.MONGODB_DATABASE_URL}?retryWrites=true&w=majority`)
    .then(() => console.log('Database connected!'))
    .catch((err) => console.error('Database connection error:', err));



// Middleware to parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//routes
app.use('/api', AuthRouter);
app.use('/api', adminRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);




app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Server is Working"
    });
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`MERN e-commerce project server port: ${port}`);
});

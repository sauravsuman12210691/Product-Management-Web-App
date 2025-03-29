require("dotenv").config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const connectDB = require("./config/db");
connectDB();
const app = express();
app.use(express.json())
app.use(cors());






app.use('/api/auth', authRoutes);



app.listen(process.env.Port, () => {
    console.log(process.env.Port)
  console.log(`Server is running on port ${process.env.Port}`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const {DBConnection} = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const dotenv = require('dotenv');
dotenv.config();
DBConnection();

app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
});
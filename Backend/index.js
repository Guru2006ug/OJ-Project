const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 👈 Add this
const app = express();
const { DBConnection } = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const dotenv = require('dotenv');
const compilerRoutes = require("./routes/compilerRoutes");
dotenv.config();
DBConnection();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 👈 Add this

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

app.use("/api/compiler", compilerRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
});

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 👈 Add this
const app = express();
const { DBConnection } = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const submissionRoute = require("./routes/submissionRoutes");
const aiReviewRoutes = require("./routes/aiReview");
const dotenv = require('dotenv');

dotenv.config();
DBConnection();

app.use(cors({
  origin: [
    'https://www.code-guru.online'
  ],
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
app.use("/api/submissions", submissionRoute);
app.use("/api/ai", aiReviewRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});


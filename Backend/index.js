
const express = require('express');
const app = express();
const {DBConnection} = require("./database/db");
const User=require('./models/User')
const bcrypt=require("bcryptjs")

DBConnection();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const jwt=require("jsonwebtoken");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/register", async (req, res) => {
    const {firstName, lastName, email, password} = req.body;

    if(!(firstName && lastName && email && password)) {
        return res.status(400).send("All fields are required.");
    }

    const existingUser=await User.findOne({email});
    if(existingUser) {
        return res.status(400).send("Email already exists.");
    }

    const hashPassword=await bcrypt.hash(password, 10);

    const user=await User.create({
        firstName,
        lastName,
        email,
        password: hashPassword
    });

    const token=jwt.sign({id: user._id,email},process.env.SECRET_KEY,{expiresIn:"24h"});

    user.token=token;
    user.password=undefined;
    res.status(200).json({message: "User registered successfully!", user});


});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
});
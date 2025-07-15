
const mongoose = require('mongoose');
const dotnev = require('dotenv');
dotnev.config();

const DBConnection=async () => {
    const MONGO_URI= process.env.MONGODB_URL;
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
};

module.exports={DBConnection};
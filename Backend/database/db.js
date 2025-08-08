
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async () => {
    const MONGO_URI = process.env.MONGODB_URL;
    
    if (!MONGO_URI) {
        console.error('MongoDB URL not found in environment variables');
        process.exit(1);
    }

    try {
        const options = {
            serverSelectionTimeoutMS: 30000, // 30 seconds
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000,
            maxPoolSize: 10,
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(MONGO_URI, options);
        console.log('MongoDB Connected successfully!');
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected!');
        });
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(DBConnection, 5000);
    }
};

module.exports = { DBConnection };
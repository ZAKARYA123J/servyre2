const { MongoClient } = require('mongodb');
require('dotenv').config();

const connection = async (app) => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB connection string is not defined.');
        }

        const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const db = client.db('project');
        app.locals.client = client;
        app.locals.db = db;

        console.log("Connected to MongoDB...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // Handle the error appropriately, you might want to throw it or exit the application
    }
}

module.exports = connection;

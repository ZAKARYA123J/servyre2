const { MongoClient } = require('mongodb');
require('dotenv').config();

const connection = async (app) => {
    try {
        const client = new MongoClient(process.env.MONGO_URL, { useUnifiedTopology: true }); // useUnifiedTopology is recommended

        await client.connect();

        const db = client.db('project');
        app.locals.client = client;
        app.locals.db = db;

        console.log('Connected to MongoDB...');

        // Close the MongoDB connection when the Node.js application is terminated
        process.on('SIGINT', async () => {
            await client.close();
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // Handle the error appropriately, you might want to throw it or exit the application
    }
};

module.exports = connection;

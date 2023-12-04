const { MongoClient } = require('mongodb');

const connection = async (app) => {
    const client = new MongoClient("mongodb://127.0.0.1:27017");

    try {
        await client.connect();
        const db = client.db('project');
        app.locals.client = client;
        app.locals.db = db;
        console.log("Connected to MongoDB...");
    } catch (error) {
        console.error(error);
    }
}


module.exports = connection;

const { MongoClient } = require('mongodb');
require('dotenv').config();

const connection = async (app) => {
    const client = await new MongoClient(process.env.MONGO_URL)
    const db = await client.db('project')

    try {
        client.connect()
        app.locals.client = client;
        app.locals.db = db
        console.log("connected...")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connection;

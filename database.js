require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

//Db connection
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let database;

async function connectDb() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    database = client.db("quality-assurance-cert-projects");

    return database;
  } catch (err) {
    console.log("MongoDB Connection Error: ", err);
    throw err;
  }
}

// TODO: create a createCollection function to use

function getCollection(myCollection) {
  const gotCollection = database.collection(myCollection);
  return gotCollection;
}

module.exports = { connectDb, getCollection };

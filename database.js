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
    await client.connect();
    database = client.db("quality-assurance-cert-projects");

    return database;
  } catch (err) {
    console.log("MongoDB Connection Error: ", err);
    throw err;
  }
}

async function isCollectionExists(collectionName) {
  const collections = await database.listCollections().toArray();
  const collectionNames = collections.map((c) => c.name);

  if (collectionNames.includes(collectionName)) {
    return true;
  } else {
    false;
  }
}

async function createCollection(name) {
  try {
    const res = await database.createCollection(name);

    return res;
  } catch (error) {
    console.log("Error creating collection: ", error);
    return undefined;
  }
}

function getCollection(myCollection) {
  const gotCollection = database.collection(myCollection);
  return gotCollection;
}

function deleteCollection(myCollection) {
  const deletedCollection = database.collection(myCollection).deleteMany({});
  return deletedCollection;
}

module.exports = {
  connectDb,
  isCollectionExists,
  createCollection,
  getCollection,
  deleteCollection,
};

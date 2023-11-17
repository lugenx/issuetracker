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

let issuesCollection;

async function connectDb() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const database = client.db("quality-assurance-cert-projects");
    issuesCollection = database.collection("issues");
    return database;
  } catch (err) {
    console.log("MongoDB Connection Error: ", err);
    throw err;
  }
}

function getIssuesCollection() {
  return issuesCollection;
}

module.exports = { connectDb, getIssuesCollection };

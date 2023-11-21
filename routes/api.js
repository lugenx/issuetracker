"use strict";
const {
  getCollection,
  createCollection,
  isCollectionExists,
} = require("../database.js");
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const collection = await getCollection(project);
      const allIssues = await collection.find({}).toArray();
      res.send(allIssues);
    })

    .post(async function (req, res) {
      let project = req.params.project;

      const collectionExists = await isCollectionExists(project);

      if (!collectionExists) {
        await createCollection(project);
      }

      const collection = await getCollection(project);

      const issue = {
        ...req.body,
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };

      const savedIssue = await collection.insertOne(issue);
      const responseObj = { ...savedIssue.insertedId, ...issue };
      res.send(responseObj);
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const collection = await getCollection(project);

      const id = new ObjectId(req.body._id);

      // TODO: fix find and update
      const issue = await collection.findOneAndUpdate(
        { _id: id },
        { $set: { open: false } }
      );
      console.log("------put--> ", project);
      console.log("-----returned issue ", issue);
    })

    .delete(function (req, res) {
      let project = req.params.project;
      console.log("------delete--> ", project);
    });
};

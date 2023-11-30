"use strict";
const {
  getCollection,
  createCollection,
  isCollectionExists,
} = require("../database.js");
const { ObjectId } = require("mongodb");
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
      console.log("---req.body---", req.body);

      const issue = {
        issue_title: await req.body.issue_title,
        issue_text: await req.body.issue_text,
        created_by: await req.body.created_by,
        assigned_to: (await req.body.assigned_to) || "",
        status_text: (await req.body.assigned_to) || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };
      console.log("----issue ", issue);
      const savedIssue = await collection.insertOne(issue);
      console.log("-----savedIssue, ", savedIssue);
      const responseObj = { ...savedIssue.insertedId, ...issue };
      console.log("--------response object", responseObj);
      res.send(await responseObj);
    })

    .put(async function (req, res) {
      let project = req.params.project;
      const collection = await getCollection(project);

      const id = new ObjectId(req.body._id);

      const issue = await collection.findOneAndUpdate(
        { _id: id },
        { $set: { open: false, updated_on: new Date() } }
      );
      if (issue) {
        const collection = await getCollection(project);
        const allIssues = await collection.find({}).toArray();
        res.send(allIssues);
      }
    })

    .delete(async function (req, res) {
      let project = req.params.project;
      const collection = await getCollection(project);

      const id = new ObjectId(req.body._id);

      const issue = await collection.findOneAndDelete({ _id: id });
      if (issue) {
        const collection = await getCollection(project);
        const allIssues = await collection.find({}).toArray();
        res.send(allIssues);
      }
    });
};

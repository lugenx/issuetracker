"use strict";
const { json } = require("body-parser");
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

      const query = await req.query;

      if (query.open) query.open = JSON.parse(query.open);

      const collection = await getCollection(project);

      const issues = await collection.find(query).toArray();

      res.send(issues);
    })

    .post(async function (req, res) {
      let project = req.params.project;

      const collectionExists = await isCollectionExists(project);

      if (!collectionExists) {
        await createCollection(project);
      }

      const collection = await getCollection(project);

      try {
        const {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
        } = await req.body;

        if (!issue_title || !issue_text)
          throw Error("required field(s) missing");

        const issue = {
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text: status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
        };

        const savedIssue = await collection.insertOne(issue);
        const responseObj = { ...savedIssue.insertedId, ...issue };

        res.send(await responseObj);
      } catch (error) {
        res.send({ error: error.message });
      }
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

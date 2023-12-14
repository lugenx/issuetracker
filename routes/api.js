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
      try {
        let project = req.params.project;

        const collection = await getCollection(project);

        const { _id, ...dataToUpdate } = req.body;

        if (!_id) return res.send({ error: "missing _id" });

        if (Object.keys(dataToUpdate).length < 1) {
          throw new Error("no update field(s) sent");
        }

        const id = new ObjectId(_id);

        dataToUpdate.updated_on = new Date();
        const issue = await collection.findOneAndUpdate(
          { _id: id },
          { $set: { ...dataToUpdate } },
          { returnDocument: "after" }
        );
        if (issue) {
          res.send({ result: "successfully updated", _id: _id });
        } else {
          throw new Error("could not update");
        }
      } catch (error) {
        res.send({ error: error.message, _id: req.body._id });
      }
    })

    .delete(async function (req, res) {
      try {
        let project = req.params.project;
        const collection = await getCollection(project);

        const { _id } = req.body;

        if (!_id) return res.send({ error: "missing _id" });

        const id = new ObjectId(req.body._id);

        const response = await collection.findOneAndDelete({ _id: id });
        if (response) {
          res.send({ result: "successfully deleted", _id: _id });
        } else {
          throw new Error("could not delete");
        }
      } catch (error) {
        res.send({ error: error.message, _id: req.body._id });
      }
    });
};

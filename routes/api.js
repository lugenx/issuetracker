"use strict";
const { getCollection } = require("../database.js");
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const issuesCollection = await getCollection("issues");
      const allIssues = await issuesCollection.find({}).toArray();
      res.send(allIssues);
    })

    .post(async function (req, res) {
      let project = req.params.project;
      // TODO: instead of issues collection, create collection with the name of each collection,
      // then save related issues to that collection

      const issuesCollection = await getCollection("issues");

      const issue = {
        project,
        ...req.body,
        created_on: new Date(),
        updated_on: new Date(),
        open: true,
      };

      const savedIssue = await issuesCollection.insertOne(issue);
      const responseObj = { ...savedIssue.insertedId, ...issue };
      console.log("responseObj", responseObj);
      res.send(responseObj);
    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log("------put--> ", project);
    })

    .delete(function (req, res) {
      let project = req.params.project;
      console.log("------delete--> ", project);
    });
};

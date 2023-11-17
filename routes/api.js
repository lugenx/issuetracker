"use strict";
const { getIssuesCollection } = require("../database.js");
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async function (req, res) {
      let project = req.params.project;
      const issuesCollection = await getIssuesCollection();
      const allIssues = await issuesCollection.find({ test: "bla" }).toArray();
      console.log("allIssues---", allIssues);
      console.log("------get--> ", project);
    })

    .post(function (req, res) {
      let project = req.params.project;
      console.log("req body itself-->", req.body);
      console.log("------post--> ", project);
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

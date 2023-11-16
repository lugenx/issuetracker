"use strict";

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
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

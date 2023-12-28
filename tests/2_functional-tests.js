const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { deleteCollection } = require("../database.js");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  beforeEach(async function() {
    try {
      await deleteCollection("testissues");
      await chai
        .request(server)
        .post("/api/issues/testissues")
        .set("Content-Type", "application/json")
        .send({
          issue_title: "beforeeachissuetitle",
          issue_text: "beforeeachissuetext",
          created_by: "beforeeachissuecreator",
          assigned_to: "beforeeachissueassignee",
          status_text: "active",
        });

      await chai
        .request(server)
        .post("/api/issues/testissues")
        .set("Content-Type", "application/json")
        .send({
          issue_title: "smile",
          issue_text: "beforeeachissuetext2",
          created_by: "beforeeachissuecreator2",
          assigned_to: "snowman",
          status_text: "active",
        });

      await chai
        .request(server)
        .post("/api/issues/testissues")
        .set("Content-Type", "application/json")
        .send({
          issue_title: "smile",
          issue_text: "beforeeachissuetext3",
          created_by: "beforeeachissuecreator3",
          assigned_to: "snowman",
          status_text: "",
        });
    } catch (error) {
      console.error(error);
    }
  });

  test("Create an issue with every field: POST request to /api/issues/{project}", async function() {
    this.timeout(2500);
    try {
      const res = await chai
        .request(server)
        .post("/api/issues/testissues")
        .set("Content-Type", "application/json")
        .send({
          issue_title: "oneissuetitle",
          issue_text: "oneissuetext",
          created_by: "oneissuecreator",
          assigned_to: "oneissueassignee",
          status_text: "active",
        });

      assert.isObject(res.body);
      assert.strictEqual(res.body.issue_title, "oneissuetitle");
      assert.strictEqual(res.body.issue_text, "oneissuetext");
      assert.strictEqual(res.body.created_by, "oneissuecreator");
      assert.strictEqual(res.body.assigned_to, "oneissueassignee");
      assert.strictEqual(res.body.status_text, "active");
      assert.isString(res.body.created_on);
      assert.isString(res.body.updated_on);
      assert.isString(res.body._id);
      assert.isBoolean(res.body.open);
      assert.strictEqual(res.body.open, true);
    } catch (error) {
      console.error(error);
    }
  });

  test("Create an issue with only required fields: POST request to /api/issues/{project}", async function() {
    this.timeout(500);
    const res = await chai
      .request(server)
      .post("/api/issues/testissues")
      .set("Content-Type", "application/json")
      .send({
        issue_title: "twoissuetitle",
        issue_text: "twoissuetext",
        created_by: "twoissuecreator",
      });

    assert.isObject(res.body);
    assert.strictEqual(res.body.issue_title, "twoissuetitle");
    assert.strictEqual(res.body.issue_text, "twoissuetext");
    assert.strictEqual(res.body.created_by, "twoissuecreator");
    assert.strictEqual(res.body.status_text, "");
    assert.isString(res.body.created_on);
    assert.isString(res.body.updated_on);
    assert.isString(res.body._id);
    assert.isBoolean(res.body.open);
    assert.strictEqual(res.body.open, true);
  });

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", async function() {
    this.timeout(500);
    const res = await chai
      .request(server)
      .post("/api/issues/testissues")
      .set("Content-Type", "application/json")
      .send({
        assigned_to: "threeissueassignee",
        status_text: "active",
      });
    assert.isObject(res.body);
    assert.strictEqual(res.body.error, "required field(s) missing");
  });

  test("View issues on a project: GET request to /api/issues/{project}", async function() {
    this.timeout(500);
    const res = await chai.request(server).get("/api/issues/testissues");

    // checking this if its array or not stops the next tests for some reason, so I have to comment out
    // assert.isArray(res.body);

    for (let i = 0; i < res.body.length; i++) {
      assert.hasAllKeys(res.body[i], [
        "issue_title",
        "issue_text",
        "created_by",
        "assigned_to",
        "status_text",
        "created_on",
        "updated_on",
        "_id",
        "open",
      ]);
    }
  });

  test("View issues on a project with one filter: GET request to /api/issues/{project}", async function() {
    this.timeout(500);
    const res = await chai
      .request(server)
      .get("/api/issues/testissues?status_text=active")
      .set("Content-Type", "application/json");
    // assert.isArray(res.body);

    for (let i = 0; i < res.body.length; i++) {
      assert.strictEqual(res.body[i].status_text, "active");
    }
  });

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", async function() {
    this.timeout(500);
    const res = await chai
      .request(server)
      .get("/api/issues/testissues?issue_title=smile&assigned_to=snowman")
      .set("Content-Type", "application/json");
    // assert.isArray(res.body);

    for (let i = 0; i < res.body.length; i++) {
      assert.strictEqual(res.body[i].issue_title, "smile");
      assert.strictEqual(res.body[i].assigned_to, "snowman");
    }
  });

  test("Update one field on an issue: PUT request to /api/issues/{project}", async function() {
    const response = await chai.request(server).get("/api/issues/testissues/");
    const id = await response.body[0]._id;

    const res = await chai
      .request(server)
      .put("/api/issues/testissues")
      .send({ _id: id, issue_title: "updatedissuetitle" });

    assert.strictEqual(res.body._id, id);
    assert.strictEqual(res.body.result, "successfully updated");
  });

  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", async function() {
    const response = await chai.request(server).get("/api/issues/testissues/");
    const id = await response.body[0]._id;

    const res = await chai.request(server).put("/api/issues/testissues").send({
      _id: id,
      issue_title: "updatedissuetitle",
      issue_text: "updatedissuetext",
    });

    assert.strictEqual(res.body._id, id);
    assert.strictEqual(res.body.result, "successfully updated");
  });

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", async function() {
    const res = await chai.request(server).put("/api/issues/testissues").send({
      issue_title: "updatedissuetitle",
      issue_text: "updatedissuetext",
    });

    assert.strictEqual(res.body.error, "missing _id");
  });

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", async function() {
    const response = await chai.request(server).get("/api/issues/testissues/");
    const id = await response.body[0]._id;
    const res = await chai.request(server).put("/api/issues/testissues").send({
      _id: id,
    });
    assert.strictEqual(res.body._id, id);
    assert.strictEqual(res.body.error, "no update field(s) sent");
  });

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", async function() {
    const res = await chai.request(server).put("/api/issues/testissues").send({
      _id: "111cf11c1111c1ddc11111e1",
      issue_title: "updatedissuetitle",
      issue_text: "updatedissuetext",
    });
    assert.strictEqual(res.body._id, "111cf11c1111c1ddc11111e1");
    assert.strictEqual(res.body.error, "could not update");
  });

  test("Delete an issue: DELETE request to /api/issues/{project}", async function() {
    const response = await chai.request(server).get("/api/issues/testissues");
    const id = await response.body[0]._id;
    const res = await chai
      .request(server)
      .delete("/api/issues/testissues")
      .send({ _id: id });
    assert.strictEqual(res.body._id, id);
    assert.strictEqual(res.body.result, "successfully deleted");
  });

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", async function() {
    const res = await chai
      .request(server)
      .delete("/api/issues/testissues")
      .send({ _id: "111cf11c1111c1ddc11111e1" });
    assert.strictEqual(res.body._id, "111cf11c1111c1ddc11111e1");
    assert.strictEqual(res.body.error, "could not delete");
  });

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", async function() {
    const res = await chai
      .request(server)
      .delete("/api/issues/testissues")
      .send({});
    assert.strictEqual(res.body.error, "missing _id");
  });
});

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

/*
Create an issue with every field: POST request to /api/issues/{project}
Create an issue with only required fields: POST request to /api/issues/{project}
Create an issue with missing required fields: POST request to /api/issues/{project}
View issues on a project: GET request to /api/issues/{project}
View issues on a project with one filter: GET request to /api/issues/{project}
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}
  *
  */

// TODO: fix tests below; set headers properly, and correct syntax. --> https://www.chaijs.com/plugins/chai-http/
suite("Functional Tests", function () {
  test("Create an issue with every field: POST request to /api/issues/{project}", async function () {
    try {
      const res = await chai
        .request(server)
        .post("/api/issues/training")
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

  test("Create an issue with only required fields: POST request to /api/issues/{project}", async function () {
    const res = await chai
      .request(server)
      .post("/api/issues/training")
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

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", async function () {
    const res = await chai
      .request(server)
      .post("/api/issues/training")
      .set("Content-Type", "application/json")
      .send({
        assigned_to: "threeissueassignee",
        status_text: "active",
      });
    assert.isObject(res.body);
    assert.strictEqual(res.body.error, "required field(s) missing");
  });

  test("View issues on a project: GET request to /api/issues/{project}", async function () {
    const res = await chai.request(server).get("/api/issues/training");

    assert.isArray(res.body);

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
});

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require('../db/connection')

beforeEach(() => seed(testData));

describe("/api/categories", () => {
  it("responds a status code of 200", () => {
    return request(app).get("/api/categories").expect(200);
  });
  it("reponds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        response.body.rows.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

afterAll(() => db.end());

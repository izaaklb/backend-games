const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

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

describe("/api/reviews/:review_id", () => {
  it("responds with a status code of 200", () => {
    return request(app).get("/api/reviews/3").expect(200);
  });
  it("responds with the review object specified in the params", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((response) => {
        expect(response.body.review_id).toBe(3);
        expect(response.body.title).toBe("Ultimate Werewolf");
      });
  });
});

afterAll(() => db.end());

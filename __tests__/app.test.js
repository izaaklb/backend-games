const seed = require("../db/seeds/seed");
const sorted = require("jest-sorted");
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
        expect(response.body.rows.length).toBe(4);
        response.body.rows.forEach((category) => {
          expect(category).toHaveProperty("slug");
          expect(category).toHaveProperty("description");
        });
      });
  });
});

describe("api/reviews", () => {
  it("responds with a status code of 200", () => {
    return request(app).get("/api/reviews").expect(200);
  });
  it("responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.rows.length).toBe(13);
        response.body.rows.forEach((review) => {
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("designer");
        });
      });
  });
  test("reviews are sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const rows = response.body.rows;
        expect(rows).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("each review contains a comment_count property which contains the number of comments made for each review id", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const rows = response.body.rows;
        rows.forEach((review) => {
          expect(review).toHaveProperty("comment_count");
        });
        expect(rows[1].comment_count).toBe("0");
        expect(rows[4].comment_count).toBe("3");
      });
  });
});

afterAll(() => db.end());

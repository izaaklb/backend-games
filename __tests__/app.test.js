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
        expect(response.body.length).toBe(4);
        response.body.forEach((category) => {
          expect(category).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("api/reviews", () => {
  it("responds with a status code of 200", () => {
    return request(app).get("/api/reviews").expect(200);
  });
});
it("responds with an array of review objects, including a comment count property", () => {
  return request(app)
    .get("/api/reviews")
    .expect(200)
    .then((response) => {
      expect(response.body.length).toBe(13);
      response.body.forEach((review) => {
        expect(review).toEqual({
          comment_count: expect.any(String),
          review_id: expect.any(Number),
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
    });
});

test("reviews are sorted by date in descending order", () => {
  return request(app)
    .get("/api/reviews")
    .expect(200)
    .then((response) => {
      expect(response.body).toBeSortedBy("created_at", { descending: true });
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
        expect(response.body).toEqual({
          review_id: expect.any(Number),
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
        expect(response.body.review_id).toBe(3);
      });
  });
});

describe("api/reviews/:review_id/comments", () => {
  it("responds with a status code of 200", () => {
    return request(app).get("/api/reviews/2/comments").expect(200);
  });
  it("responds with an array of comments for the given review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        response.body.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
            author: expect.any(String)
          })
        });
      });
  });
  it("responds sorted by date, with most recent first", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeSortedBy("created_at", { descending: true });
      });
  });
});

afterAll(() => db.end());

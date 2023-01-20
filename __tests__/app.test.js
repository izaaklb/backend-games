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
  it("responds with a status code of 404 if the review does not exist", () => {
    return request(app)
      .get("/api/reviews/5000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
  it("responds with a status code of 400 if the query is invalid", () => {
    return request(app)
      .get("/api/reviews/WRONG")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
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
        expect(response.body.length).toBe(3);
        response.body.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            review_id: expect.any(Number),
            votes: expect.any(Number),
            body: expect.any(String),
            created_at: expect.any(String),
            author: expect.any(String),
          });
        });
      });
  });
  it("responds with an empty array if there are no comments for the review id", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(0);
      });
  });
  it("responds sorted by date, with most recent first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("responds with a status code of 404 when review does not exist", () => {
    return request(app)
      .get("/api/reviews/5000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
  it("responds with a status code of 400 when review query is invalid", () => {
    return request(app)
      .get("/api/reviews/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("api/reviews/:review_id/comments", () => {
  it("responds with the posted comment, status code 201", () => {
    const newComment = {
      username: "mallionaire",
      body: "occaecat saved my life",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          comment_id: expect.any(Number),
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          review_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  it("responds with status 404 if review does not exist", () => {
    const newComment = {
      username: "mallionaire",
      body: "occaecat saved my life",
    };
    return request(app)
      .post("/api/reviews/500/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
  it("responds with status 400 when body is malformed", () => {
    const newComment = {
      hi: "helloooo",
    };
    return request(app)
      .post("/api/reviews/6/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("responds with status 400 when body values are wrong type", () => {
    const newComment = {
      username: 424325252,
      body: true,
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("api/reviews/:review_id", () => {
  it("responds with updated review and a status code of 202", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 10 })
      .expect(202)
      .then((response) => {
        expect(response.body.votes).toBe(11);
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
      });
  });
  it("responds with status code 400 when passed an invalid body", () => {
    const voteIncrement = {
      wrong: 10,
    };
    return request(app).patch("/api/reviews/2").send(voteIncrement).expect(400);
  });
  it("responds with status code 400 when passed an invalid query", () => {
    const voteIncrement = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/wrong")
      .send(voteIncrement)
      .expect(400);
  });
  it("responds with status code 404 when passed a review that does not exist", () => {
    const voteIncrement = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/reviews/875239729")
      .send(voteIncrement)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
});

afterAll(() => db.end());

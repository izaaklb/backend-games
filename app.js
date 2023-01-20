const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  getUsers
} = require("./controller");
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);
app.patch("/api/reviews/:review_id", patchVotes);
app.get("/api/users", getUsers)


//custom error
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

//psql error
app.use((err, req, res, next) => {
  if (err.code === "22P02" || "42703") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use("*", (req, res) => {
  res.status(404).send({ msg: "route does not exist" });
});

app.use((err, req, res, next) => {
  res.status(500).send(err);
  console.log(err);
  res.status(500).send("Server Error!");
});

module.exports = app;

const {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertComment,
  incrementVotes,
  fetchUsers,
  incrementCommentVotes
} = require("./model");

getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch(next);
};

getReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query;
  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      response.status(200).send(reviews);
    })
    .catch(next);
};

getReviewById = (request, response, next) => {
  const id = request.params;
  fetchReviewById(id)
    .then((review_object) => {
      response.status(200).send(review_object);
    })
    .catch(next);
};

getCommentsByReviewId = (request, response, next) => {
  const id = request.params;
  fetchCommentsByReviewId(id)
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch(next);
};

postComment = (request, response, next) => {
  const newComment = request.body;
  const review_id = request.params;
  insertComment(review_id, newComment)
    .then((comment) => {
      response.status(201).send(comment);
    })
    .catch(next);
};

patchVotes = (request, response, next) => {
  const reviewId = request.params;
  const voteIncrement = request.body;
  incrementVotes(reviewId, voteIncrement)
    .then((updatedReview) => {
      response.status(202).send(updatedReview);
    })
    .catch(next);
};

getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send(users);
  })
  .catch(next);
};

patchCommentVotes = (request, response, next) => {
  const commentId = request.params;
  const voteIncrement = request.body;
  incrementCommentVotes(commentId, voteIncrement).then((updatedComment)=> {
    response.status(202).send(updatedComment);
  })
  .catch(next);
}

module.exports = {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  patchVotes,
  getUsers,
  patchCommentVotes
};

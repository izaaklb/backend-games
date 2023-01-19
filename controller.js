const { fetchCategories, fetchReviews, fetchReviewById, fetchCommentsByReviewId } = require("./model");

getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch(next);
};

getReviews = (request, response, next) => {
  fetchReviews()
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
  fetchCommentsByReviewId(id).then((comments) => {
    response.status(200).send(comments);
  })
  .catch(next);
};

module.exports = {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
};

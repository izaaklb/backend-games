const { fetchCategories, fetchReviews, fetchReview } = require("./model");

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

getReview = (request, response, next) => {
  const id = request.params;
  fetchReview(id)
    .then((review_object) => {
      response.status(200).send(review_object);
    })
    .catch(next);
};




module.exports = { getCategories, getReviews, getReview };


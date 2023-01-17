const { fetchCategories, fetchReview } = require("./model");

getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch(next);
};

getReview = (request, response, next) => {
  const id = request.params;
  const id_number = id.review_id;
  fetchReview(id_number)
    .then((review) => {
      response.status(200).send(review);
    })
    .catch(next);
};

module.exports = { getCategories, getReview };

const { fetchCategories, fetchReviews } = require("./model");

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

module.exports = { getCategories };

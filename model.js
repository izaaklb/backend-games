const db = require("./db/connection");

fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`);
};

fetchReview = (id) => {
  const id_number = id.review_id;
  return db.query(`SELECT * FROM reviews WHERE review_id = ${id_number}`)
  .then((review) => {
    return review.rows[0]
  })
};

module.exports = { fetchCategories, fetchReview };

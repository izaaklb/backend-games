const db = require("./db/connection");

fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`);
};

fetchReview = (id_number) => {
  return db.query(`SELECT * FROM reviews WHERE review_id = ${id_number}`);
};

module.exports = { fetchCategories, fetchReview };

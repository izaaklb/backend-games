const db = require("./db/connection");

fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`);
};

fetchReviews = () => {
  return db.query(`SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM comments 
  FULL OUTER JOIN reviews ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC;`);
};

module.exports = { fetchCategories, fetchReviews };

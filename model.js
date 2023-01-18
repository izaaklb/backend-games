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

fetchReview = (id) => {
  const id_number = id.review_id;
  return db.query(`SELECT * FROM reviews WHERE review_id = ${id_number}`)
  .then((review) => {
    return review.rows[0]
  })
};

module.exports = { fetchCategories, fetchReviews, fetchReview };


const db = require("./db/connection");

fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count
  FROM comments 
  FULL OUTER JOIN reviews ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC;`
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

fetchReviewById = (id) => {
  const id_number = id.review_id;
  return db
    .query(`SELECT * FROM reviews WHERE review_id = ${id_number}`)
    .then((review) => {
      return review.rows[0];
    });
};

fetchCommentsByReviewId = (id) => {
  const id_number = id.review_id;
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = ${id_number}
    ORDER BY created_at DESC;`
    )
    .then((comments) => {
      return comments.rows;
    });
};

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
};

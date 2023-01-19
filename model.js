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
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [id_number])
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
      return user;
    });
};

fetchCommentsByReviewId = (id) => {
  const id_number = id.review_id;
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1
    ORDER BY created_at DESC;`,
      [id_number]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return db
          .query(`SELECT * FROM reviews WHERE review_id = $1`, [id_number])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({
                status: 404,
                msg: "review does not exist",
              });
            } return [];
          });
      }
      return rows;
    });
};

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
};

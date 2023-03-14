const db = require("./db/connection");

fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

fetchReviews = (category, sort_by = 'created_at', order = 'DESC') => {
  let sqlQuery = `SELECT reviews.*, 
  COUNT(comments.review_id) AS comment_count
  FROM reviews 
  FULL OUTER JOIN comments ON reviews.review_id = comments.review_id`
  const queryValues = []

  if(category !== undefined) {
    queryValues.push(category);
    sqlQuery += ` WHERE reviews.category = $1`
  }
    sqlQuery += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}; `
    
    return db.query(sqlQuery, queryValues)
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
            }
            return [];
          });
      }
      return rows;
    });
};

insertComment = (review_id, newComment) => {
  const reviewIdNum = review_id.review_id;
  const { body, username } = newComment;

  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewIdNum])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
      return db
        .query(
          `INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) 
  RETURNING *;`,
          [body, reviewIdNum, username]
        )
        .then((response) => {
          return response.rows[0];
        });
    });
};

incrementVotes = (reviewId, voteIncrement) => {
  reviewIdNum = reviewId.review_id;
  voteIncrementNum = voteIncrement.inc_votes;
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE 
  review_id = $2 RETURNING *`,
      [voteIncrementNum, reviewIdNum]
    )
    .then((response) => {
      if (!response.rows[0]) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
      return response.rows[0];
    });
};

fetchUsers = () => {
  return db.query(`SELECT * FROM USERS;`).then((users) => {
    return users.rows;
  });
};

incrementCommentVotes = (commentId, voteIncrement)  => {
  CommentIdNum = commentId.comment_id;
  voteIncrementNum = voteIncrement.inc_votes;
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE 
  comment_id = $2 RETURNING *`,
      [voteIncrementNum, CommentIdNum]
    ).then((response) => {
      if (!response.rows[0]) {
        return Promise.reject({ status: 404, msg: "review does not exist" });
      }
      return response.rows[0];
    })
}

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewById,
  fetchCommentsByReviewId,
  insertComment,
  incrementVotes,
  fetchUsers,
  incrementCommentVotes
};

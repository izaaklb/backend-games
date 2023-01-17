const db = require("./db/connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./db/seeds/utils");

fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`);
};

fetchReviews = () => {
  let date = convertTimestampToDate({ created_at: 1610964101251 });
  console.log(date);

  return db.query(`SELECT * FROM reviews`);
};

module.exports = { fetchCategories, fetchReviews };

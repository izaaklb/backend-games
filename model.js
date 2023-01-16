const db = require("./db/connection")

fetchCategories = () => {
return db.query(`SELECT * FROM categories;`)
}

module.exports = { fetchCategories }
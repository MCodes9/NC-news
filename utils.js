const format = require("pg-format");
const articles = require("./db/data/test-data/articles");

// in utils.js
const checkExists = (table, column, value) => {
  // %I is an identifier in pg-format
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  return db.query(queryStr, [value]).then((rows) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource not found" });
    }
    return articles.rows;
  });
};

// exports.checkTopicExists = (topic) => {
//   const queryStr = ` SELECT * FROM topics WHERE slug = $1`;
//   if (!topic) {
//     return true;
//   }
//   return db.query(queryStr, [topic]).then(({ rows }) => {
//     if (!rows.length) {
//       return Promise.reject({ status: 404, msg: "Topic not found" });
//     } else {
//       return true;
//     }
//   });
// };

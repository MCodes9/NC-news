const db = require("../db/connection");

exports.fetchComments = (articleId) => {
  let queryStr = "SELECT * FROM comments WHERE article_id = $1;";
  return db.query(queryStr, [articleId]).then(({ rows }) => {
    return rows;
  });
};

const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  let queryStr = " SELECT * FROM articles WHERE article_id = $1";

  return db.query(queryStr, [article_id]).then((article) => {
    if (!article.rows.length) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    return article.rows[0];
  });
};

exports.updateArticleById = (article_id, increase_votes) => {
  let queryStr =
    " UPDATE articles SET votes= votes + $1 WHERE article_id = $2 RETURNING *;";

  if (!increase_votes) {
    return Promise.reject({
      status: 400,
      msg: "No change in votes",
    });
  }
  return db.query(queryStr, [increase_votes, article_id]).then((article) => {
    if (!article.rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article not found",
      });
    }
    return article.rows[0];
  });
};

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

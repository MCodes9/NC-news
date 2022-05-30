const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  const queryStr =
    " SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;";

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
      msg: "Bad request",
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

exports.fetchAllArticles = () => {
  const queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id):: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;";
  return db.query(queryStr).then((articles) => {
    return articles.rows;
  });
};

exports.addComment = (articleId, newComment) => {
  const { username, body } = newComment;
  if (username && body) {
    if (typeof username !== "string" || typeof body !== "string") {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  }
  return db
    .query(
      `
    INSERT INTO comments
    (author, article_id, body)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `,
      [username, articleId, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

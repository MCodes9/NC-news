const db = require("../db/connection.js");

exports.fetchArticleById = (article_id) => {
  const queryStr = ` SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`;

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

exports.fetchAllArticles = (sortBy = "created_at", order = "DESC", topic) => {
  let queryStr =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id):: INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id ";
  const queryValues = [];
  const validSortBys = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];

  const validOrderBys = ["ASC", "DESC", "asc", "desc"];

  if (!validSortBys.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Invalid sort by query" });
  }
  if (!validOrderBys.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if (topic) {
    queryStr += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  queryStr += `GROUP BY articles.article_id
  ORDER BY ${sortBy} ${order};`;
  console.log(queryStr);
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

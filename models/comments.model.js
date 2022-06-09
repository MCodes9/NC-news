const db = require("../db/connection");

exports.fetchComments = (articleId) => {
  const queryStr = "SELECT * FROM comments WHERE article_id = $1;";
  return db.query(queryStr, [articleId]).then(({ rows }) => {
    return rows;
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

exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Non-existent comment cannot be deleted",
        });
      }
    });
};

const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  patchArticleById,
  getAllArticles,
} = require("./controllers/articles.controller");
const {
  getComments,
  postComment,
  deleteCommentById,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const {
  handlePathErrors,
  handleInternalServerError,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchArticleById);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

// ERROR HANDLING:
app.all("/*", handlePathErrors);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerError);

module.exports = app;

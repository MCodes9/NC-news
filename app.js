const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
} = require("../NC-news/controllers/articles.controller");

const {
  handlePathErrors,
  handleInternalServerError,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

// ERROR HANDLING:
app.all("/*", handlePathErrors);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalServerError);

module.exports = app;

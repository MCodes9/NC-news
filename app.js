const { getTopics } = require("../NC-news/controllers/topics.controllers");
const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

// ERROR HANDLING:
app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;

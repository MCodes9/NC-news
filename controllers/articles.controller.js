const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articles.model.js");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  console.log("line 27 in controller");
  fetchAllArticles()
    .then((articles) => {
      console.log("line 30 in controller");
      res.status(200).send({ articles });
    })
    .catch(next);
};

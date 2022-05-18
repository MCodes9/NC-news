const {
  fetchArticleById,
  updateArticleById,
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
  // console.log("in the controller");
  const { article_id } = req.params;
  console.log(req.body);
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch(next);
};

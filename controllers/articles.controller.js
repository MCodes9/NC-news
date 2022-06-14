const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articles.model.js");

const { checkExists } = require("../utils");

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
  const { sort_by, order, topic } = req.query;
  const promiseAllArr = [fetchAllArticles(sort_by, order, topic)];

  if (topic) {
    promiseAllArr.push(checkExists("topics", "slug", topic, "Topic not found"));
  }
  console.log(promiseAllArr);
  Promise.all(promiseAllArr)
    .then(([articles]) => {
      console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(next);
};

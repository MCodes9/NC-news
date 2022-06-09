const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articles.model.js");
const { fetchTopics } = require("../models/topics.model.js");

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
  fetchTopics()
    .then((topics) => {
      const mappedTopics = topics.map((topic) => topic.slug);
      return fetchAllArticles(mappedTopics, sort_by, order, topic);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

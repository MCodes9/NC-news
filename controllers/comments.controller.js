const { fetchComments } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(() => {
      return fetchComments(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

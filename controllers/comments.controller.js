const { fetchComments, addComment } = require("../models/comments.model");
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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  const promises = [
    fetchArticleById(article_id),
    addComment(article_id, newComment),
  ];

  Promise.all(promises)
    .then(([article_id, newAddedComment]) => {
      res.status(201).send({ newAddedComment });
    })
    .catch(next);
};

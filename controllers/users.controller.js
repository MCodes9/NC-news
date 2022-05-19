const { fetchUsers } = require("../models/users.model.js");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

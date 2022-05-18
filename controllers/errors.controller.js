exports.handlePathErrors = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err, "Line 14 custom error");
  if (err) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInternalServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};

const format = require("pg-format");
const db = require("./db/connection");

exports.checkExists = async (table, column, value, message) => {
  console.log("run");
  // %I is an identifier in pg-format
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0) {
    // resource does NOT exist
    return Promise.reject({ status: 404, msg: message });
  }
  return true;
};

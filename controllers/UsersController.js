const ApiError = require("../error/ApiError");
const db = require("../database");

class UsersController {
  getUsers(req, res, next) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 16;
    if (Number.isNaN(Number(page)) || Number.isNaN(Number(limit))) {
      next(ApiError.badRequest("Query must be a number"));
    } else {
      let offset = page * limit - limit;
      db.all(
        `SELECT * FROM users AS a INNER JOIN users_stats AS b ON a.user_id = b.user_id LIMIT ${limit} OFFSET ${offset}`,
        (err, rows) => {
          if (err) {
            next(ApiError.internal(err));
          }
          db.get("SELECT count(*) FROM users", (err, row) => {
            res.json({
              data: rows,
              page: page,
              limit: limit,
              allPage: Math.ceil(row["count(*)"] / limit) + "",
            });
          });
        }
      );
    }
  }
}

module.exports = new UsersController();

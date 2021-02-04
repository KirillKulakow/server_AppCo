const ApiError = require("../error/ApiError");
const db = require("../database");

class StatsController {
  getInfo(req, res, next) {
    const { user_id } = req.params;
    const { dateIn, dateOut } = req.query;
    const reg = /\d{4}(-|\/)\d{2}\1\d{2}/g;
    const validDate =
      dateIn && dateOut ? reg.test(dateIn) || reg.test(dateOut) : true;
    if (!validDate) {
      next(ApiError.badRequest("Date in query must be 'yyyy-mm-dd'"));
    } else if (!user_id) {
      next(ApiError.badRequest("ID user is required"));
    } else {
      const filterDate =
        dateIn && dateOut
          ? `and date BETWEEN ${Date.parse(dateIn)} and ${Date.parse(dateOut)}`
          : "";
      db.all(
        `SELECT * FROM users_stats WHERE user_id=${user_id} ${filterDate}`,
        (err, rows) => {
          if (err) {
            next(ApiError.internal(err));
          }
          res.json({
            data: rows,
            user_id,
            dateIn,
            dateOut,
          });
        }
      );
    }
  }
}

module.exports = new StatsController();

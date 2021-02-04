const usersJSON = require("./users.json");
const usersStats = require("./users_statistic.json");

async function createUsers(db) {
  return new Promise((res, rej) => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, gender TEXT NOT NULL, ip_address TEXT NOT NULL, UNIQUE(email, ip_address) )",
      () => {
        db.get("SELECT count(*) FROM users", (err, row) => {
          if (err) {
            rej(err);
          }
          if (row["count(*)"] < usersJSON.length) {
            let e = db.prepare(
              "INSERT OR IGNORE INTO users VALUES (?, ?, ?, ?, ?, ?)"
            );
            usersJSON.forEach((el) => {
              e.run(
                el.id,
                el.first_name,
                el.last_name,
                el.email,
                el.gender,
                el.ip_address
              );
            });

            e.finalize(() => res());
          } else {
            res();
          }
        });
      }
    );
  });
}
async function createStats(db) {
  return new Promise((res, rej) => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users_stats (user_id INTEGER NOT NULL, date INTEGER NOT NULL, page_views INTEGER, clicks INTEGER, FOREIGN KEY (user_id) REFERENCES users (user_id), UNIQUE (user_id, date))",
      () => {
        db.get("SELECT count(*) FROM users_stats", (err, row) => {
          if (err) {
            rej(err);
          }
          if (row["count(*)"] < usersStats.length) {
            let e = db.prepare(
              "INSERT OR IGNORE INTO users_stats VALUES (?, ?, ?, ?)"
            );
            usersStats.forEach((el) => {
              e.run(
                el.user_id,
                Date.parse(el.date),
                el.page_views || 0,
                el.clicks || 0
              );
            });

            e.finalize(() => res());
          } else {
            res();
          }
        });
      }
    );
  });
}

module.exports = {
  createUsers,
  createStats,
};

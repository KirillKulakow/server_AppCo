const sqlite3 = require("sqlite3").verbose();
const { createUsers, createStats } = require("./controllers");

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, async (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    await createUsers(db);
    await createStats(db);
  }
});

module.exports = db;

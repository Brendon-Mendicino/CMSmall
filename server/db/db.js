import sqlite from "sqlite3";

const db = new sqlite.Database("db/db.sqlite", (err) => {
  if (err) throw err;
});

// Enable foreign_keys constraints
// In sqlite3 they are disabled by default
db.exec("PRAGMA foreign_keys = ON;", (err) => {
  if (err) throw err;
});

sqlite.Database.prototype.runAsync = function (sql, ...params) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
};

sqlite.Database.prototype.runBatchAsync = function ({ statements, failure }) {
  var results = [];
  var batch = [...statements];

  return batch
    .reduce(
      (chain, statement) =>
        chain.then((result) => {
          results.push(result);
          return db.runAsync(...statement);
        }),
      Promise.resolve()
    )
    .catch((err) =>
      db
        .runAsync(...failure)
        .then(() => Promise.reject(err + " in statement #" + results.length))
    )
    .then(() => results);
};

export default db;

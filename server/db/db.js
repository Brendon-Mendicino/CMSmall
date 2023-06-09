import sqlite from "sqlite3";

const db = new sqlite.Database("db/db.sqlite", (err) => {
  if (err) throw err;
});

// Enable foreign_keys constraints
// In sqlite3 they are disabled by default
db.exec("PRAGMA foreign_keys = ON;", (err) => {
  if (err) throw err;
});

export default db;

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../db/tournament.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;", (err) => {
    if (err) {
      console.error("Error enabling foreign keys:", err.message);
    }
  });
});

module.exports = db;

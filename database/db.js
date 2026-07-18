const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "workjournal.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("SQLite Connected");

    db.run("PRAGMA foreign_keys = ON;", (err) => {
      if (err) {
        console.error("Failed to enable foreign keys:", err.message);
      } else {
        console.log("Foreign keys enabled");
      }
    });
  }
});

module.exports = db;    
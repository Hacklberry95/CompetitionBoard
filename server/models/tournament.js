// models/Tournament.js
const sqlite3 = require("sqlite3").verbose();

class Tournament {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS Tournaments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Name TEXT,
          Date TEXT,
          Location TEXT
      );
    `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating tournaments table:", err.message);
      } else {
        console.log("Tournaments table created.");
      }
    });
  }

  constructor(name, date, location) {
    this.name = name;
    this.date = date;
    this.location = location;
  }

  save(db) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO Tournaments (Name, Date, Location)
        VALUES (?, ?, ?);
      `;
      db.run(query, [this.name, this.date, this.location], function (err) {
        if (err) reject(err);
        else resolve(this.lastID); // returns the last inserted ID
      });
    });
  }

  static findAll(db) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Tournaments;`;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static findById(db, id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Tournaments WHERE id = ?;`;
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static update(db, id, { name, date, location }) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE Tournaments
        SET Name = ?, Date = ?, Location = ?
        WHERE id = ?;
      `;
      db.run(query, [name, date, location, id], function (err) {
        if (err) reject(err);
        else resolve(this.changes); // returns number of rows affected
      });
    });
  }

  static delete(db, id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM Tournaments WHERE id = ?;`;
      db.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes); // returns number of rows affected
      });
    });
  }
}

module.exports = Tournament;

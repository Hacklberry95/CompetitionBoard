// models/Tournament.js
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

  save(db, callback) {
    const query = `
            INSERT INTO Tournaments (Name, Date, Location)
            VALUES (?, ?, ?);
        `;
    db.run(query, [this.name, this.date, this.location], callback);
  }

  static findAll(db, callback) {
    const query = `SELECT * FROM Tournaments;`;
    db.all(query, [], callback);
  }

  static findById(db, id, callback) {
    const query = `SELECT * FROM Tournaments WHERE id = ?;`;
    db.get(query, [id], callback);
  }

  static update(db, id, { name, date, location }, callback) {
    const query = `
            UPDATE Tournaments
            SET Name = ?, Date = ?, Location = ?
            WHERE id = ?;
        `;
    db.run(query, [name, date, location, id], callback);
  }

  static delete(db, id, callback) {
    const query = `DELETE FROM Tournaments WHERE id = ?;`;
    db.run(query, [id], callback);
  }
}

module.exports = Tournament;

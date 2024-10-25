// models/Tournament.js
class Tournament {
  static createTable(db) {
    const query = `
            CREATE TABLE IF NOT EXISTS tournaments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                date TEXT,
                location TEXT
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
            INSERT INTO tournaments (name, date, location)
            VALUES (?, ?, ?);
        `;
    db.run(query, [this.name, this.date, this.location], callback);
  }

  static findAll(db, callback) {
    const query = `SELECT * FROM tournaments;`;
    db.all(query, [], callback);
  }

  static findById(db, id, callback) {
    const query = `SELECT * FROM tournaments WHERE id = ?;`;
    db.get(query, [id], callback);
  }

  static update(db, id, { name, date, location }, callback) {
    const query = `
            UPDATE tournaments
            SET name = ?, date = ?, location = ?
            WHERE id = ?;
        `;
    db.run(query, [name, date, location, id], callback);
  }

  static delete(db, id, callback) {
    const query = `DELETE FROM tournaments WHERE id = ?;`;
    db.run(query, [id], callback);
  }
}

module.exports = Tournament;

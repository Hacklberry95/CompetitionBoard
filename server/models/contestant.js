class Contestant {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS contestants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        tournamentId INTEGER,
        FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
      );
    `;
    db.run(query);
  }

  constructor(fullName, tournamentId) {
    this.fullName = fullName;
    this.tournamentId = tournamentId;
  }

  save(db, callback) {
    const query = `INSERT INTO contestants (fullName, tournamentId) VALUES (?, ?);`;
    db.run(query, [this.fullName, this.tournamentId], callback);
  }

  static findByTournamentId(db, tournamentId, callback) {
    db.all(
      `SELECT * FROM contestants WHERE tournamentId = ?;`,
      [tournamentId],
      callback
    );
  }

  static update(db, id, { fullName }, callback) {
    db.run(
      `UPDATE contestants SET fullName = ? WHERE id = ?;`,
      [fullName, id],
      callback
    );
  }

  static delete(db, id, callback) {
    db.run(`DELETE FROM contestants WHERE id = ?;`, [id], callback);
  }

  static deleteById(db, id, tournamentId, callback) {
    // First, check if a contestant with the given ID exists for the specified tournament
    db.get(
      `SELECT * FROM contestants WHERE id = ? AND tournamentId = ?;`,
      [id, tournamentId],
      (err, row) => {
        if (err) {
          return callback(err);
        }
        if (!row) {
          return callback(
            new Error(
              `Contestant with ID ${id} not found in tournament ${tournamentId}.`
            )
          );
        }

        // If contestant exists, delete it
        db.run(
          `DELETE FROM contestants WHERE id = ? AND tournamentId = ?;`,
          [id, tournamentId],
          (err) => {
            if (err) {
              return callback(err);
            }
            callback(
              null,
              `Contestant with ID ${id} deleted from tournament ${tournamentId}.`
            );
          }
        );
      }
    );
  }
}

module.exports = Contestant;

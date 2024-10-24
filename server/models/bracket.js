class bracket {
  static createTable(db) {
    const query = `
            CREATE TABLE IF NOT EXISTS brackets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tournamentId INTEGER,
                matches TEXT,  -- Store matches as a serialized structure (e.g., JSON)
                FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
            );
        `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating brackets table:", err.message);
      } else {
        console.log("Brackets table created.");
      }
    });
  }

  constructor(tournamentId, matches) {
    this.tournamentId = tournamentId;
    this.matches = JSON.stringify(matches); // Serialize matches as a JSON string
  }

  save(db, callback) {
    const query = `
            INSERT INTO brackets (tournamentId, matches)
            VALUES (?, ?);
        `;
    db.run(query, [this.tournamentId, this.matches], callback);
  }

  static findByTournamentId(db, tournamentId, callback) {
    const query = `
            SELECT * FROM brackets WHERE tournamentId = ?;
        `;
    db.get(query, [tournamentId], (err, row) => {
      if (err) {
        return callback(err);
      }
      if (row) {
        row.matches = JSON.parse(row.matches); // Deserialize matches
      }
      return callback(null, row);
    });
  }
}

module.exports = bracket;

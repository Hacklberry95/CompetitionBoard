// models/Bracket.js
class Bracket {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS brackets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournamentId INTEGER,
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

  constructor(tournamentId) {
    this.tournamentId = tournamentId;
  }

  save(db, callback) {
    const query = `
      INSERT INTO brackets (tournamentId)
      VALUES (?);
    `;
    db.run(query, [this.tournamentId], function (err) {
      callback(err, this.lastID);
    });
  }

  static linkMatches(db, bracketId, matchIds, callback) {
    const query = `
      INSERT INTO bracket_matches (bracketId, matchId)
      VALUES (?, ?);
    `;
    const insertPromises = matchIds.map((matchId) => {
      return new Promise((resolve, reject) => {
        db.run(query, [bracketId, matchId], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
    Promise.all(insertPromises)
      .then(() => callback(null))
      .catch(callback);
  }

  static findByTournamentId(db, tournamentId, callback) {
    const query = `
      SELECT * FROM brackets WHERE tournamentId = ?;
    `;
    db.get(query, [tournamentId], (err, row) => {
      if (err) {
        return callback(err);
      }
      return callback(null, row);
    });
  }

  // Update a bracket
  static update(db, id, { tournamentId }, callback) {
    const query = `
      UPDATE brackets SET tournamentId = ? WHERE id = ?;
    `;
    db.run(query, [tournamentId, id], (err) => {
      callback(err);
    });
  }

  // Delete a bracket
  static delete(db, id, callback) {
    const query = `
      DELETE FROM brackets WHERE id = ?;
    `;
    db.run(query, [id], (err) => {
      callback(err);
    });
  }
}

module.exports = Bracket;

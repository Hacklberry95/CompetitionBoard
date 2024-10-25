// models/match.js
class Match {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournamentId INTEGER,
        participant1 TEXT,
        participant2 TEXT,
        winner TEXT,
        FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
      );
    `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating matches table:", err.message);
      } else {
        console.log("Matches table created.");
      }
    });
  }

  constructor(tournamentId, participant1, participant2, winner = null) {
    this.tournamentId = tournamentId;
    this.participant1 = participant1;
    this.participant2 = participant2;
    this.winner = winner;
  }

  // Create (save) a new match
  save(db, callback) {
    const query = `
      INSERT INTO matches (tournamentId, participant1, participant2, winner)
      VALUES (?, ?, ?, ?);
    `;
    db.run(
      query,
      [this.tournamentId, this.participant1, this.participant2, this.winner],
      function (err) {
        callback(err, this.lastID); // `this.lastID` gives the ID of the newly created match
      }
    );
  }

  // Retrieve all matches by tournamentId
  static findByTournamentId(db, tournamentId, callback) {
    const query = `
      SELECT * FROM matches WHERE tournamentId = ?;
    `;
    db.all(query, [tournamentId], (err, rows) => {
      callback(err, rows);
    });
  }

  // Update match details
  static update(db, id, { participant1, participant2, winner }, callback) {
    const query = `
      UPDATE matches
      SET participant1 = ?, participant2 = ?, winner = ?
      WHERE id = ?;
    `;
    db.run(query, [participant1, participant2, winner, id], (err) => {
      callback(err);
    });
  }

  // Delete a match
  static delete(db, id, callback) {
    const query = `
      DELETE FROM matches WHERE id = ?;
    `;
    db.run(query, [id], (err) => {
      callback(err);
    });
  }
}

module.exports = Match;

class Match {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournamentId INTEGER,
        participant1 TEXT,
        participant2 TEXT,
        winner TEXT,
        round INTEGER,
        position INTEGER,
        FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
      );
    `;
    db.run(query);
  }

  constructor(
    tournamentId,
    participant1,
    participant2,
    winner = null,
    round = null,
    position = null
  ) {
    this.tournamentId = tournamentId;
    this.participant1 = participant1;
    this.participant2 = participant2;
    this.winner = winner;
    this.round = round;
    this.position = position;
  }

  save(db, callback) {
    const query = `INSERT INTO matches (tournamentId, participant1, participant2, winner, round, position) VALUES (?, ?, ?, ?, ?, ?);`;
    db.run(
      query,
      [
        this.tournamentId,
        this.participant1,
        this.participant2,
        this.winner,
        this.round,
        this.position,
      ],
      callback
    );
  }

  static findByTournamentId(db, tournamentId, callback) {
    db.all(
      `SELECT * FROM matches WHERE tournamentId = ?;`,
      [tournamentId],
      callback
    );
  }
}

module.exports = Match;

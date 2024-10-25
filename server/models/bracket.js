class Bracket {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS brackets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tournamentId INTEGER,
        name TEXT,
        level TEXT,
        gender TEXT,
        hand TEXT,
        weight TEXT,
        FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
      );
    `;
    db.run(query);
  }

  constructor(tournamentId, name, level, gender, hand, weight) {
    this.tournamentId = tournamentId;
    this.name = name;
    this.level = level;
    this.gender = gender;
    this.hand = hand;
    this.weight = weight;
  }

  save(db, callback) {
    const query = `INSERT INTO brackets (tournamentId, name, level, gender, hand, weight) VALUES (?, ?, ?, ?, ?, ?);`;
    db.run(
      query,
      [
        this.tournamentId,
        this.name,
        this.level,
        this.gender,
        this.hand,
        this.weight,
      ],
      callback
    );
  }

  static findByTournamentId(db, tournamentId, callback) {
    db.all(
      `SELECT * FROM brackets WHERE tournamentId = ?;`,
      [tournamentId],
      callback
    );
  }
}

module.exports = Bracket;

class BracketMatches {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS bracket_matches (
        bracketId INTEGER,
        matchId INTEGER,
        PRIMARY KEY (bracketId, matchId),
        FOREIGN KEY (bracketId) REFERENCES brackets(id),
        FOREIGN KEY (matchId) REFERENCES matches(id)
      );
    `;
    db.run(query);
  }

  static linkMatch(db, bracketId, matchId, callback) {
    const query = `INSERT INTO bracket_matches (bracketId, matchId) VALUES (?, ?);`;
    db.run(query, [bracketId, matchId], callback);
  }
}

module.exports = BracketMatches;

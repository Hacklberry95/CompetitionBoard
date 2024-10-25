// models/BracketMatches.js
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
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating bracket_matches table:", err.message);
      } else {
        console.log("Bracket matches table created.");
      }
    });
  }
}

module.exports = BracketMatches;

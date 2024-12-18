// models/BracketEntries.js
class BracketEntries {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS BracketEntries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        BracketId INTEGER,
        ContestantId INTEGER,
        FOREIGN KEY (BracketId) REFERENCES Brackets(id),
        FOREIGN KEY (ContestantId) REFERENCES Contestants(id)
      );
    `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating bracketEntries table:", err.message);
      } else {
        console.log("BracketEntries table created.");
      }
    });
  }

  constructor(bracketId, contestantId) {
    this.bracketId = bracketId;
    this.contestantId = contestantId;
  }

  save(db, callback) {
    const query = `
      INSERT INTO BracketEntries (BracketId, contestantId)
      VALUES (?, ?);
    `;
    db.run(query, [this.bracketId, this.contestantId], function (err) {
      callback(err, this.lastId);
    });
  }

  static findAll(db, callback) {
    const query = `SELECT * FROM BracketEntries;`;
    db.all(query, [], callback);
  }

  static findById(db, id, callback) {
    const query = `SELECT * FROM BracketEntries WHERE id = ?;`;
    db.get(query, [id], callback);
  }

  static update(db, id, { bracketId, contestantId }, callback) {
    const query = `
      UPDATE BracketEntries
      SET BracketId = ?, contestantId = ?
      WHERE id = ?;
    `;
    db.run(query, [bracketId, contestantId, id], function (err) {
      callback(err);
    });
  }

  static delete(db, id, callback) {
    const query = `DELETE FROM BracketEntries WHERE id = ?;`;
    db.run(query, [id], function (err) {
      callback(err);
    });
  }
  static deleteAll(db, tournamentId) {
    const query = `
    DELETE FROM BracketEntries
    WHERE bracketId IN (
      SELECT id FROM Brackets WHERE tournamentId = ?
    );
  `;

    return new Promise((resolve, reject) => {
      db.run(query, [tournamentId], function (err) {
        if (err) {
          console.error("Error deleting bracket entries:", err.message);
          return reject(err);
        }
        console.log("Bracket entries deleted successfully.");
        resolve();
      });
    });
  }

  static deleteByBracketId(db, bracketId, callback) {
    const query = `DELETE FROM BracketEntries WHERE id = ?;`;
    db.all(query, [bracketId], callback);
  }

  static findByBracketId(db, bracketId, callback) {
    const query = `SELECT * FROM BracketEntries WHERE BracketId = ?;`;
    db.all(query, [bracketId], callback);
  }

  static findBycontestantId(db, contestantId, callback) {
    const query = `SELECT * FROM BracketEntries WHERE contestantId = ?;`;
    db.all(query, [contestantId], callback);
  }
  static count(db) {
    return new Promise((resolve, reject) => {
      const query = "SELECT COUNT(*) AS count FROM BracketEntries";
      db.get(query, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row.count);
      });
    });
  }
}

module.exports = BracketEntries;

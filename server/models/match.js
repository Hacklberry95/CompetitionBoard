// models/Matches.js
class Matches {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS Matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        BracketId INTEGER,
        RoundNumber INTEGER,
        MatchNumber INTEGER,
        Participant1Id INTEGER,
        Participant2Id INTEGER,
        WinnerId INTEGER,
        LoserId INTEGER,
        FOREIGN KEY (BracketId) REFERENCES Brackets(id),
        FOREIGN KEY (Participant1Id) REFERENCES Contestants(id),
        FOREIGN KEY (Participant2Id) REFERENCES Contestants(id),
        FOREIGN KEY (WinnerId) REFERENCES Contestants(id),
        FOREIGN KEY (LoserId) REFERENCES Contestants(id)
      );
    `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating Matches table:", err.message);
      } else {
        console.log("Matches table created.");
      }
    });
  }

  constructor(
    bracketId,
    roundNumber,
    matchNumber,
    participant1Id,
    participant2Id,
    winnerId,
    loserId
  ) {
    this.bracketId = bracketId;
    this.roundNumber = roundNumber;
    this.matchNumber = matchNumber;
    this.participant1Id = participant1Id;
    this.participant2Id = participant2Id;
    this.winnerId = winnerId;
    this.loserId = loserId;
  }

  save(db, callback) {
    const query = `
      INSERT INTO Matches (BracketId, RoundNumber, MatchNumber, Participant1Id, Participant2Id, WinnerId, LoserId)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    db.run(
      query,
      [
        this.bracketId,
        this.roundNumber,
        this.matchNumber,
        this.participant1Id,
        this.participant2Id,
        this.winnerId,
        this.loserId,
      ],
      function (err) {
        callback(err, this.lastId);
      }
    );
  }
  static create(
    db,
    bracketId,
    roundNumber,
    matchNumber,
    participant1Id,
    participant2Id,
    callback
  ) {
    const query = `
      INSERT INTO Matches (BracketId, RoundNumber, MatchNumber, Participant1Id, Participant2Id)
      VALUES (?, ?, ?, ?, ?);
    `;
    db.run(
      query,
      [bracketId, roundNumber, matchNumber, participant1Id, participant2Id],
      callback
    );
  }

  static findAll(db, callback) {
    const query = `SELECT * FROM Matches;`;
    db.all(query, [], callback);
  }

  static findById(db, id, callback) {
    const query = `SELECT * FROM Matches WHERE id = ?;`;
    db.get(query, [id], callback);
  }

  static update(
    db,
    id,
    {
      bracketId,
      roundNumber,
      matchNumber,
      participant1Id,
      participant2Id,
      winnerId,
      loserId,
    },
    callback
  ) {
    const query = `
      UPDATE Matches
      SET BracketId = ?, RoundNumber = ?, MatchNumber = ?, Participant1Id = ?, Participant2Id = ?, WinnerId = ?, LoserId = ?
      WHERE id = ?;
    `;
    db.run(
      query,
      [
        bracketId,
        roundNumber,
        matchNumber,
        participant1Id,
        participant2Id,
        winnerId,
        loserId,
        id,
      ],
      function (err) {
        callback(err);
      }
    );
  }

  static delete(db, id, callback) {
    const query = `DELETE FROM Matches WHERE id = ?;`;
    db.run(query, [id], function (err) {
      callback(err);
    });
  }
  static deleteAll(db, callback) {
    const query = `DELETE FROM Matches;`;
    db.run(query, function (err) {
      callback(err);
    });
  }

  static findByBracketId(db, bracketId, callback) {
    const query = `SELECT * FROM Matches WHERE BracketId = ?;`;
    db.all(query, [bracketId], callback);
  }

  static findByParticipantId(db, participantId, callback) {
    const query = `
      SELECT * FROM Matches
      WHERE Participant1Id = ? OR Participant2Id = ?;
    `;
    db.all(query, [participantId, participantId], callback);
  }
  static findByContestantId(db, contestantId, callback) {
    const query = `
      SELECT * FROM Matches
      WHERE Participant1Id = ? OR Participant2Id = ?;
    `;
    db.all(query, [contestantId, contestantId], callback);
  }
}

module.exports = Matches;

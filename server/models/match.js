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

  static async findAll(db, callback) {
    const query = `SELECT * FROM Matches;`;
    await db.all(query, [], callback);
  }

  static async findById(db, id, callback) {
    const query = `SELECT * FROM Matches WHERE id = ?;`;
    await db.get(query, [id], callback);
  }

  static async update(
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

  static async delete(db, id, callback) {
    const query = `DELETE FROM Matches WHERE id = ?;`;
    await db.run(query, [id], function (err) {
      callback(err);
    });
  }
  static async deleteAll(db, tournamentId) {
    const query = `
    DELETE FROM Matches
    WHERE bracketId IN (
      SELECT id FROM Brackets WHERE tournamentId = ?
    );
  `;

    return new Promise((resolve, reject) => {
      db.run(query, [tournamentId], function (err) {
        if (err) {
          console.error("Error deleting matches:", err.message);
          return reject(err);
        }
        console.log("Matches deleted successfully.");
        resolve();
      });
    });
  }

  static async findByBracketId(db, bracketId, callback) {
    const query = `SELECT * FROM Matches WHERE BracketId = ?;`;
    await db.all(query, [bracketId], callback);
  }

  static async findByParticipantId(db, participantId) {
    const query = `SELECT * FROM Matches WHERE Participant1Id = ? OR Participant2Id = ?`;

    return new Promise((resolve, reject) => {
      db.all(query, [participantId, participantId], (err, rows) => {
        if (err) {
          console.error(
            "Error finding matches by participant ID:",
            err.message
          );
          reject(err);
        } else {
          resolve(rows || []); // Ensure it returns an empty array if no rows are found
        }
      });
    });
  }
  // Match winner/loser logic

  static async findAvailableMatch(db, bracketId, roundNumber, isLosersBracket) {
    const query = `
    SELECT * FROM Matches 
    WHERE BracketId = ? AND RoundNumber = ? AND isLosersBracket = ? 
      AND (Participant1Id IS NULL OR Participant2Id IS NULL)
    LIMIT 1;
  `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, roundNumber, isLosersBracket], (err, match) => {
        if (err) {
          console.error("Error finding available match:", err.message);
          reject(err);
        } else {
          resolve(match); // returns the match with an empty slot, if available
        }
      });
    });
  }
  // Function to update a match with a winner and loser
  static declareWinner(database, matchId, winnerId, loserId) {
    const query = `UPDATE Matches SET WinnerId = ?, LoserId = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      database.run(query, [winnerId, loserId, matchId], function (err) {
        if (err) {
          console.error("Error in declareWinner:", err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async placeContestantInMatch(
    db,
    bracketId,
    roundNumber,
    contestantId,
    isLosersBracket
  ) {
    // Step 1: Find an existing match with an open slot
    const existingMatch = await Matches.findAvailableMatch(
      db,
      bracketId,
      roundNumber,
      isLosersBracket
    );

    if (existingMatch) {
      // Place the contestant in the open slot of the existing match
      const participantField = existingMatch.Participant1Id
        ? "Participant2Id"
        : "Participant1Id";
      const query = `UPDATE Matches SET ${participantField} = ? WHERE id = ?`;
      return new Promise((resolve, reject) => {
        db.run(query, [contestantId, existingMatch.id], function (err) {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      // Step 2: Find the next MatchNumber for the round
      const nextMatchNumberQuery = `
      SELECT COALESCE(MAX(MatchNumber), 0) + 1 AS NextMatchNumber 
      FROM Matches 
      WHERE BracketId = ? AND RoundNumber = ? AND isLosersBracket = ?;
    `;
      const nextMatchNumber = await new Promise((resolve, reject) => {
        db.get(
          nextMatchNumberQuery,
          [bracketId, roundNumber, isLosersBracket],
          (err, row) => {
            if (err) reject(err);
            else resolve(row.NextMatchNumber);
          }
        );
      });

      // Step 3: Create a new match with the calculated MatchNumber
      const insertQuery = `
      INSERT INTO Matches (BracketId, RoundNumber, MatchNumber, Participant1Id, isLosersBracket)
      VALUES (?, ?, ?, ?, ?);
    `;
      return new Promise((resolve, reject) => {
        db.run(
          insertQuery,
          [
            bracketId,
            roundNumber,
            nextMatchNumber,
            contestantId,
            isLosersBracket,
          ],
          function (err) {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }
  }

  static async handleMatchResult(
    db,
    matchId,
    winnerId,
    loserId,
    isLosersBracket,
    bracketId,
    roundNumber
  ) {
    // Update the completed match
    await Matches.declareWinner(db, matchId, winnerId, loserId);

    if (!isLosersBracket) {
      // Winner continues in winners' bracket
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        roundNumber + 1,
        winnerId,
        false
      );

      // Loser moves to the losers' bracket
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        roundNumber,
        loserId,
        true
      );
    } else {
      console.log(`Contestant ${loserId} is eliminated from the tournament.`);
    }
  }
}

module.exports = Matches;

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
  // <==================================================== Match winner/loser logic ====================================================>

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
          resolve(match);
        }
      });
    });
  }

  // Update a match with a winner and a loser
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

  // Handle match result and move contestants to the appropriate bracket
  static async handleMatchResult(
    db,
    matchId,
    winnerId,
    loserId,
    isLosersBracket,
    bracketId,
    roundNumber
  ) {
    await Matches.declareWinner(db, matchId, winnerId, loserId);

    if (!isLosersBracket) {
      // Winners' Bracket: winner goes to next Winners' round, loser drops to Losers' Bracket
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        roundNumber + 1,
        winnerId,
        false
      );
      const targetLosersRound = roundNumber === 0 ? 0 : roundNumber * 2 - 1;
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        targetLosersRound,
        loserId,
        true
      );
    } else {
      // Losers' Bracket: winner advances in Losers' bracket, loser is eliminated
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        roundNumber + 1,
        winnerId,
        true
      );
      console.log(
        `Losers' bracket: ${loserId} is eliminated if they lose again.`
      );
    }

    // Check if we should create a final match between the last winners of both brackets
    await Matches.checkAndCreateFinalMatch(db, bracketId);
  }

  // Place contestant in the next appropriate match slot
  static async placeContestantInMatch(
    db,
    bracketId,
    roundNumber,
    contestantId,
    isLosersBracket
  ) {
    const existingMatch = await Matches.findAvailableMatch(
      db,
      bracketId,
      roundNumber,
      isLosersBracket
    );
    if (existingMatch) {
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
      // Create a new match if no available slot is found
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

  static async checkAndCreateFinalMatch(db, bracketId) {
    // Fetch the last winners from both brackets
    const winnersChampion = await Matches.findLastWinner(db, bracketId, false);
    const losersChampion = await Matches.findLastWinner(db, bracketId, true);

    // Ensure both champions are identified and have a valid WinnerId
    if (winnersChampion?.WinnerId && losersChampion?.WinnerId) {
      // Check if a final match already exists to prevent duplicate creation
      const existingFinalMatch = await Matches.findFinalMatch(db, bracketId);

      if (!existingFinalMatch) {
        // Create the final match with both champions
        await Matches.createFinalMatch(
          db,
          bracketId,
          winnersChampion.WinnerId,
          losersChampion.WinnerId
        );
        console.log(
          "Final match created between winners' and losers' champions."
        );
        return true; // Indicate that the final match was successfully created
      }
    }
    console.log(
      "One or both champions are missing. Final match will not be created yet."
    );
    return false;
  }

  static async findLastWinner(db, bracketId, isLosersBracket) {
    const query = `
      SELECT * FROM Matches 
      WHERE BracketId = ? AND isLosersBracket = ? 
      ORDER BY RoundNumber DESC, MatchNumber DESC 
      LIMIT 1;
    `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, isLosersBracket], (err, match) => {
        if (err) reject(err);
        else resolve(match);
      });
    });
  }

  static async findFinalMatch(db, bracketId) {
    const query = `
      SELECT * FROM Matches 
      WHERE BracketId = ? AND RoundNumber = 'Final';
    `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId], (err, match) => {
        if (err) reject(err);
        else resolve(match);
      });
    });
  }

  static async createFinalMatch(
    db,
    bracketId,
    winnersChampionId,
    losersChampionId
  ) {
    const insertQuery = `
      INSERT INTO Matches (BracketId, RoundNumber, MatchNumber, Participant1Id, Participant2Id)
      VALUES (?, 'Final', 1, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.run(
        insertQuery,
        [bracketId, winnersChampionId, losersChampionId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

module.exports = Matches;

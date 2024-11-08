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
        isLosersBracket BOOLEAN,
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
        callback(err, this.lastID);
      }
    );
  }

  static async declareWinner(db, matchId, winnerId, loserId) {
    const query = `UPDATE Matches SET WinnerId = ?, LoserId = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [winnerId, loserId, matchId], function (err) {
        if (err) {
          console.error("Error in declareWinner:", err.message);
          reject(err);
        } else {
          console.log(
            `Winner declared for match ${matchId}: WinnerId = ${winnerId}, LoserId = ${loserId}`
          );
          resolve();
        }
      });
    });
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
    console.log(
      `Handling result for match ${matchId}: Winner = ${winnerId}, Loser = ${loserId}, Round = ${roundNumber}, isLosersBracket = ${isLosersBracket}`
    );
    await Matches.declareWinner(db, matchId, winnerId, loserId);

    if (!isLosersBracket) {
      const nextWinnersRound = roundNumber + 1;
      console.log(
        `Placing winner ${winnerId} in next winners round ${nextWinnersRound}`
      );
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        nextWinnersRound,
        winnerId,
        false
      );

      const targetLosersRound = roundNumber === 0 ? 0 : roundNumber * 2 - 1;
      console.log(
        `Placing loser ${loserId} in first losers round ${targetLosersRound}`
      );
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        targetLosersRound,
        loserId,
        true
      );
    } else {
      const nextLosersRound = roundNumber + 1;
      console.log(
        `Placing winner ${winnerId} in next losers round ${nextLosersRound}`
      );
      await Matches.placeContestantInMatch(
        db,
        bracketId,
        nextLosersRound,
        winnerId,
        true
      );
    }

    const finalMatchCreated = await Matches.checkAndCreateFinalMatch(
      db,
      bracketId
    );
    return finalMatchCreated;
  }

  static async placeContestantInMatch(
    db,
    bracketId,
    roundNumber,
    contestantId,
    isLosersBracket
  ) {
    console.log(
      `Placing contestant ${contestantId} in bracket ${bracketId}, round ${roundNumber}, isLosersBracket = ${isLosersBracket}`
    );
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
          else {
            console.log(
              `Contestant ${contestantId} placed in existing match ${existingMatch.id}`
            );
            resolve();
          }
        });
      });
    } else {
      const query = `
        INSERT INTO Matches (BracketId, RoundNumber, MatchNumber, Participant1Id, isLosersBracket)
        VALUES (?, ?, (SELECT IFNULL(MAX(MatchNumber), 0) + 1 FROM Matches WHERE BracketId = ? AND RoundNumber = ?), ?, ?);
      `;
      return new Promise((resolve, reject) => {
        db.run(
          query,
          [
            bracketId,
            roundNumber,
            bracketId,
            roundNumber,
            contestantId,
            isLosersBracket,
          ],
          function (err) {
            if (err) reject(err);
            else {
              console.log(
                `New match created for contestant ${contestantId} in round ${roundNumber}`
              );
              resolve();
            }
          }
        );
      });
    }
  }

  static async checkAndCreateFinalMatch(db, bracketId) {
    try {
      // Check for champions in both brackets
      const winnersChampionId = await Matches.getChampion(db, bracketId, false);
      const losersChampionId = await Matches.getChampion(db, bracketId, true);

      console.log("Winners' Bracket Champion ID:", winnersChampionId);
      console.log("Losers' Bracket Champion ID:", losersChampionId);

      // Get the last round numbers for each bracket
      const lastWinnersRound = await Matches.getLastRoundNumber(
        db,
        bracketId,
        false
      );
      const lastLosersRound = await Matches.getLastRoundNumber(
        db,
        bracketId,
        true
      );

      // Verify both brackets are at their final match with no future rounds
      const isWinnersFinalRoundComplete = await Matches.isFinalRound(
        db,
        bracketId,
        lastWinnersRound,
        false
      );
      const isLosersFinalRoundComplete = await Matches.isFinalRound(
        db,
        bracketId,
        lastLosersRound,
        true
      );

      // Confirm there are no remaining rounds with unfinished matches in both brackets
      const noFutureMatchesWinners =
        !(await Matches.hasUnfinishedMatchesInFutureRounds(
          db,
          bracketId,
          lastWinnersRound,
          false
        ));
      const noFutureMatchesLosers =
        !(await Matches.hasUnfinishedMatchesInFutureRounds(
          db,
          bracketId,
          lastLosersRound,
          true
        ));

      // Ensure we only create the final match if both brackets are completely resolved
      const fullyCompletedBrackets =
        isWinnersFinalRoundComplete &&
        isLosersFinalRoundComplete &&
        noFutureMatchesWinners &&
        noFutureMatchesLosers;

      if (winnersChampionId && losersChampionId && fullyCompletedBrackets) {
        const existingFinalMatch = await Matches.findFinalMatch(db, bracketId);
        if (!existingFinalMatch) {
          console.log("Creating final championship match...");
          await Matches.createFinalMatch(
            db,
            bracketId,
            winnersChampionId,
            losersChampionId
          );
          console.log("Final championship match created successfully.");
          return true;
        } else {
          console.log("Final match already exists.");
        }
      } else {
        console.log(
          "Waiting for champions in both brackets and full bracket completion before creating the final match."
        );
      }
    } catch (error) {
      console.error("Error in checkAndCreateFinalMatch:", error.message);
    }
    return false;
  }

  // < ============================== HELPER METHODS ===========================>
  static async isSingleMatchRound(db, bracketId, roundNumber, isLosersBracket) {
    const query = `
    SELECT COUNT(*) as matchCount
    FROM Matches
    WHERE BracketId = ? AND RoundNumber = ? AND isLosersBracket = ?;
  `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, roundNumber, isLosersBracket], (err, row) => {
        if (err) {
          console.error("Error checking single match round:", err.message);
          reject(err);
        } else {
          resolve(row.matchCount === 1); // Returns true if there's only one match in the round
        }
      });
    });
  }
  static async hasUnfinishedMatchesInFutureRounds(
    db,
    bracketId,
    currentRound,
    isLosersBracket
  ) {
    const query = `
    SELECT COUNT(*) as unfinishedMatches
    FROM Matches
    WHERE BracketId = ? AND RoundNumber > ? AND isLosersBracket = ? AND WinnerId IS NULL;
  `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, currentRound, isLosersBracket], (err, row) => {
        if (err) {
          console.error(
            "Error checking unfinished future rounds:",
            err.message
          );
          reject(err);
        } else {
          resolve(row.unfinishedMatches > 0); // True if there are unfinished matches in future rounds
        }
      });
    });
  }

  static async getChampion(db, bracketId, isLosersBracket) {
    // Adjust this query to fetch only the last match in the bracket with a declared winner
    const query = `
    SELECT WinnerId 
    FROM Matches 
    WHERE BracketId = ? AND isLosersBracket = ? AND WinnerId IS NOT NULL
    ORDER BY RoundNumber DESC, MatchNumber DESC 
    LIMIT 1;
  `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, isLosersBracket], (err, row) => {
        if (err) {
          console.error("Error finding champion:", err.message);
          reject(err);
        } else {
          const championId = row?.WinnerId || null;
          console.log(
            `${
              isLosersBracket ? "Losers" : "Winners"
            } Bracket Champion ID: ${championId}`
          );
          resolve(championId);
        }
      });
    });
  }

  static async getLastRoundNumber(db, bracketId, isLosersBracket) {
    const query = `
    SELECT MAX(RoundNumber) as lastRound 
    FROM Matches 
    WHERE BracketId = ? AND isLosersBracket = ?;
  `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, isLosersBracket], (err, row) => {
        if (err) {
          console.error("Error fetching last round number:", err.message);
          reject(err);
        } else {
          resolve(row.lastRound);
        }
      });
    });
  }

  static async isFinalRound(db, bracketId, roundNumber, isLosersBracket) {
    const query = `
    SELECT COUNT(*) as unfinishedMatches 
    FROM Matches 
    WHERE BracketId = ? AND RoundNumber = ? AND isLosersBracket = ? AND WinnerId IS NULL;
  `;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, roundNumber, isLosersBracket], (err, row) => {
        if (err) {
          console.error("Error checking if round is finalized:", err.message);
          reject(err);
        } else {
          // Round is finalized if no matches are unfinished
          resolve(row.unfinishedMatches === 0);
        }
      });
    });
  }
  static async findAvailableMatch(db, bracketId, roundNumber, isLosersBracket) {
    const query = `SELECT * FROM Matches WHERE BracketId = ? AND RoundNumber = ? AND isLosersBracket = ? AND (Participant1Id IS NULL OR Participant2Id IS NULL) LIMIT 1;`;
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

  static async findFinalMatch(db, bracketId) {
    const finalRoundNumber = 999; // Use the same integer for the final round
    const query = `SELECT * FROM Matches WHERE BracketId = ? AND RoundNumber = ?`;
    return new Promise((resolve, reject) => {
      db.get(query, [bracketId, finalRoundNumber], (err, match) => {
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
    const finalRoundNumber = 999; // Assign a special integer for the final round
    const query = `
    INSERT INTO Matches (BracketId, RoundNumber, MatchNumber, Participant1Id, Participant2Id, isLosersBracket)
    VALUES (?, ?, 1, ?, ?, 0);
  `;
    return new Promise((resolve, reject) => {
      db.run(
        query,
        [bracketId, finalRoundNumber, winnersChampionId, losersChampionId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Additional methods to support CRUD and other operations
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
      WHERE BracketId IN (
        SELECT id FROM Brackets WHERE tournamentId = ?
      );
    `;
    return new Promise((resolve, reject) => {
      db.run(query, [tournamentId], function (err) {
        if (err) {
          console.error("Error deleting matches:", err.message);
          reject(err);
        } else {
          console.log("Matches deleted successfully.");
          resolve();
        }
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
          resolve(rows || []);
        }
      });
    });
  }
}

module.exports = Matches;

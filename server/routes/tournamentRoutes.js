// routes/tournamentRoutes.js
const express = require("express");
const router = express.Router();
const Tournament = require("../models/tournament");
const Contestant = require("../models/contestant");
const Match = require("../models/match");
const Bracket = require("../models/brackets");
const path = require("path");
const BracketEntries = require("../models/bracketEntries");

const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

// Create a new tournament
router.post("/tournaments", (req, res) => {
  const { Name, Date, Location } = req.body;
  const newTournament = new Tournament(Name, Date, Location);
  newTournament.save(db, function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating tournament", error: err });
    }
    return res
      .status(201)
      .json({ message: "Tournament created successfully!", id: this.lastID });
  });
});

// Get all tournaments
router.get("/tournaments", (req, res) => {
  Tournament.findAll(db, (err, tournaments) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching tournaments", error: err });
    }
    return res.json(tournaments);
  });
});

// Get a tournament by ID
router.get("/tournaments/:id", (req, res) => {
  const { id } = req.params;
  Tournament.findById(db, id, (err, tournament) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching tournament", error: err });
    }
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    return res.json(tournament);
  });
});

// Update a tournament
router.put("/tournaments/:id", (req, res) => {
  const { id } = req.params;
  const { name, date, location } = req.body;
  Tournament.update(db, id, { name, date, location }, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating tournament", error: err });
    }
    return res.json({ message: "Tournament updated successfully!" });
  });
});

// Delete a tournament
router.delete("/tournaments/:id", (req, res) => {
  const { id } = req.params;
  Tournament.delete(db, id, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting tournament", error: err });
    }
    return res.json({ message: "Tournament deleted successfully!" });
  });
});

router.delete("/tournaments/:tournamentId/deleteAll", async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const bracketEntriesCount = await BracketEntries.count(db);
    if (bracketEntriesCount === 0) {
      return res
        .status(404)
        .json({ message: "No BracketEntries found to delete." });
    }
    const deletionPromises = [
      new Promise((resolve, reject) => {
        Match.deleteAll(db, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }),
      new Promise((resolve, reject) => {
        Bracket.deleteAll(db, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }),
      new Promise((resolve, reject) => {
        BracketEntries.deleteAll(db, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }),
    ];

    await Promise.all(deletionPromises);
    return res.json({
      message:
        "All matches, brackets, and bracket entries deleted successfully.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting records", error: err });
  }
});

// Add a contestant to a tournament
router.post("/tournaments/:tournamentId/contestants", (req, res) => {
  const { tournamentId } = req.params;
  const { Name, Gender, WeightKg, ArmPreference, Division } = req.body;

  const newContestant = new Contestant(
    tournamentId,
    Name,
    Gender,
    WeightKg,
    ArmPreference,
    Division
  );

  newContestant.save(db, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding contestant", error: err });
    }
    return res.status(201).json({ message: "Contestant added successfully!" });
  });
});

// Endpoint to generate brackets and matches for a tournament
router.post("/tournaments/:tournamentId/generateBrackets", (req, res) => {
  const { tournamentId } = req.params;

  const existingContestantIds = new Set();
  const fetchExistingContestants = (contestants) => {
    const checkPromises = contestants.map((contestant) => {
      return new Promise((resolve, reject) => {
        Match.findByParticipantId(db, contestant.id, (err, matches) => {
          if (err) {
            return reject(err);
          }
          if (matches.length > 0) {
            existingContestantIds.add(contestant.id);
          }
          resolve();
        });
      });
    });
    return Promise.all(checkPromises);
  };

  Contestant.findByTournamentId(db, tournamentId, (err, contestants) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching contestants." });
    }

    if (contestants.length === 0) {
      return res
        .status(400)
        .json({ error: "No contestants found for this tournament." });
    }

    fetchExistingContestants(contestants)
      .then(() => {
        const newContestants = contestants.filter(
          (contestant) => !existingContestantIds.has(contestant.id)
        );

        if (newContestants.length === 0) {
          return res.status(400).json({
            error:
              "Cannot generate brackets. All contestants are already in matches.",
          });
        }

        const brackets = {};
        newContestants.forEach((contestant) => {
          const weightClass =
            contestant.WeightKg < 0
              ? `${Math.abs(contestant.WeightKg)}-`
              : `${contestant.WeightKg}`;
          const key = `${contestant.Division}|${contestant.Gender}|${contestant.ArmPreference}|${weightClass}`;

          if (!brackets[key]) brackets[key] = [];
          brackets[key].push(contestant);
        });

        const bracketPromises = Object.keys(brackets).map((key) => {
          const [division, gender, arm, weightClass] = key.split("|");

          return new Promise((resolve, reject) => {
            Bracket.create(
              db,
              tournamentId,
              division,
              gender,
              arm,
              weightClass,
              (err, bracketId) => {
                if (err) return reject(new Error("Error creating bracket"));
                const bracketEntryStmt = db.prepare(`
            INSERT INTO BracketEntries (BracketID, ContestantId) VALUES (?, ?)
        `);
                brackets[key].forEach((contestant) => {
                  bracketEntryStmt.run(bracketId, contestant.id);
                });

                const shuffledParticipants = brackets[key].sort(
                  () => 0.5 - Math.random()
                );
                const matchPromises = [];

                for (let i = 0; i < shuffledParticipants.length; i += 2) {
                  if (i + 1 < shuffledParticipants.length) {
                    matchPromises.push(
                      new Promise((resolve, reject) => {
                        Match.create(
                          db,
                          bracketId,
                          1,
                          Math.floor(i / 2) + 1,
                          shuffledParticipants[i].id,
                          shuffledParticipants[i + 1].id,
                          (err) => {
                            if (err) return reject(err);
                            resolve();
                          }
                        );
                      })
                    );
                  }
                }

                Promise.all(matchPromises)
                  .then(() => resolve())
                  .catch(reject);
              }
            );
          });
        });

        Promise.all(bracketPromises)
          .then(() =>
            res.status(200).json({
              message: "Brackets and matches generated successfully.",
            })
          )
          .catch((err) => {
            return res.status(500).json({
              error: "Error generating brackets or matches.",
              details: err.message,
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          error: "Error checking existing contestants.",
          details: err.message,
        });
      });
  });
});

module.exports = router;

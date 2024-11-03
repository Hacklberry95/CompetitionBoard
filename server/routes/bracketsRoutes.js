// routes/bracketRoutes.js
const express = require("express");
const router = express.Router();
const Bracket = require("../models/brackets");
const Contestant = require("../models/contestant");
const Match = require("../models/match");
const BracketEntries = require("../models/bracketEntries");
const db = require("../db");

// Get all brackets for a specific tournament
router.get("/brackets/tournament/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;

  Bracket.findByTournamentId(db, tournamentId, (err, brackets) => {
    if (err) {
      console.error("Error fetching brackets:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching brackets", error: err });
    }
    return res.json(brackets);
  });
});

// Get a bracket by its ID
router.get("/brackets/:id", (req, res) => {
  const { id } = req.params;

  Bracket.findById(db, id, (err, bracket) => {
    if (err) {
      console.error("Error fetching bracket:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching bracket", error: err });
    }
    if (!bracket) {
      return res.status(404).json({ message: "Bracket not found" });
    }
    return res.json(bracket);
  });
});

// Create a new bracket
router.post("/brackets", (req, res) => {
  const { tournamentId, division, gender, arm, weightClass } = req.body;

  if (!tournamentId || !division || !gender || !arm || !weightClass) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const bracket = new Bracket(tournamentId, division, gender, arm, weightClass);
  bracket.save(db, (err) => {
    if (err) {
      console.error("Error creating bracket:", err.message);
      return res
        .status(500)
        .json({ message: "Error creating bracket", error: err });
    }
    return res.status(201).json({ message: "Bracket created successfully!" });
  });
});

// Update a bracket
router.put("/brackets/:id", (req, res) => {
  const { id } = req.params;
  const { tournamentId, division, gender, arm, weightClass } = req.body;

  // Ensure all required fields are provided for update
  if (!tournamentId || !division || !gender || !arm || !weightClass) {
    return res.status(400).json({ message: "All fields are required." });
  }

  Bracket.update(
    db,
    id,
    { tournamentId, division, gender, arm, weightClass },
    (err) => {
      if (err) {
        console.error("Error updating bracket:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating bracket", error: err });
      }
      return res.json({ message: "Bracket updated successfully!" });
    }
  );
});

// Delete a bracket
router.delete("/brackets/:id", (req, res) => {
  const { id } = req.params;

  Bracket.delete(db, id, (err) => {
    if (err) {
      console.error("Error deleting bracket:", err.message);
      return res
        .status(500)
        .json({ message: "Error deleting bracket", error: err });
    }
    return res.json({ message: "Bracket deleted successfully!" });
  });
});

// Delete all brackets, entries, and matches from a tournament
router.delete("/brackets/:tournamentId/deleteAll", async (req, res) => {
  const { tournamentId } = req.params;

  try {
    // Ensure there are entries to delete
    const bracketEntriesCount = await BracketEntries.count(db);
    if (bracketEntriesCount === 0) {
      return res
        .status(404)
        .json({ message: "No BracketEntries found to delete." });
    }

    // Delete dependent tables first, then Brackets
    await Promise.all([
      BracketEntries.deleteAll(db), // Delete entries that reference Brackets
      Match.deleteAll(db), // Delete matches that reference Brackets
    ]);

    // Delete Brackets after the dependent tables have been cleared
    await Bracket.deleteAll(db);

    res.status(200).json({
      message:
        "All matches, brackets, and bracket entries deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting records:", error.message);
    res.status(500).json({ message: "Error deleting records", error });
  }
});

// <=============================BRACKET GENERATION=============================>
// routes/bracketsRoutes.js
router.post("/brackets/:tournamentId/generateBrackets", async (req, res) => {
  const { tournamentId } = req.params;
  const existingContestantIds = new Set();

  console.log(`Starting bracket generation for tournament ID: ${tournamentId}`);
  console.log("Fetching contestants for the tournament...");

  try {
    const contestants = await Contestant.findByTournamentId(db, tournamentId);

    if (!contestants || contestants.length === 0) {
      console.log("No contestants found for this tournament.");
      return res
        .status(400)
        .json({ error: "No contestants found for this tournament." });
    }

    console.log(
      `Found ${contestants.length} contestants for tournament ${tournamentId}`
    );

    // Filter out contestants who are already in matche
    await Promise.all(
      contestants.map(async (contestant) => {
        const matches = await Match.findByParticipantId(db, contestant.id);
        if (matches.length > 0) {
          existingContestantIds.add(contestant.id);
        }
      })
    );

    const newContestants = contestants.filter(
      (contestant) => !existingContestantIds.has(contestant.id)
    );

    if (newContestants.length === 0) {
      console.log("All contestants are already in matches.");
      return res
        .status(400)
        .json({ error: "All contestants are already in matches." });
    }

    // Generate brackets and matches
    const brackets = createBrackets(newContestants);
    await createMatchesAndEntries(brackets, db, tournamentId);

    res
      .status(201)
      .json({ message: "Brackets and matches generated successfully." });
  } catch (error) {
    console.error("Error generating brackets or matches:", error);
    res.status(500).json({
      error: "Error generating brackets or matches.",
      details: error.message,
    });
  }
});

// Helper to create brackets based on contestants
function createBrackets(contestants) {
  const brackets = {};
  contestants.forEach((contestant) => {
    const weightClass =
      contestant.WeightKg < 0
        ? `${Math.abs(contestant.WeightKg)}-`
        : `${contestant.WeightKg}`;
    const key = `${contestant.Division}|${contestant.Gender}|${contestant.ArmPreference}|${weightClass}`;

    if (!brackets[key]) brackets[key] = [];
    brackets[key].push(contestant);
  });
  return brackets;
}

// Helper to create matches and entries in the database
async function createMatchesAndEntries(brackets, db, tournamentId) {
  for (const key in brackets) {
    const [division, gender, arm, weightClass] = key.split("|");
    console.log(`Processing bracket for ${key}`);

    try {
      // Insert the bracket into the Brackets table
      const bracketId = await Bracket.create(
        db,
        tournamentId,
        division,
        gender,
        arm,
        weightClass
      );
      console.log(`Created bracket with ID: ${bracketId}`);

      const bracketEntryStmt = db.prepare(
        `INSERT INTO BracketEntries (BracketID, ContestantId) VALUES (?, ?)`
      );

      // Shuffle contestants and insert bracket entries and matches in pairs
      const contestants = brackets[key].sort(() => 0.5 - Math.random());

      for (let i = 0; i < contestants.length; i += 2) {
        const c1 = contestants[i];
        const c2 = contestants[i + 1];
        bracketEntryStmt.run(bracketId, c1.id);

        if (c2) {
          bracketEntryStmt.run(bracketId, c2.id);
          const match = await Match.create(
            db,
            bracketId,
            0,
            Math.floor(i / 2) + 1,
            c1.id,
            c2.id
          );
          console.log(
            `Match created between contestant ${c1.id} and contestant ${c2.id}`
          );
        } else {
          console.log(`Contestant ${c1.id} has no opponent in this bracket.`);
        }
      }
      bracketEntryStmt.finalize();
    } catch (error) {
      console.error(
        `Error creating matches or entries for bracket: ${key}`,
        error
      );
      throw new Error(`Error creating matches or entries for bracket: ${key}`);
    }
  }
}

module.exports = router;

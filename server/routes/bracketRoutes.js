// bracketRoutes.js
const express = require("express");
const router = express.Router();
const Bracket = require("../models/bracket");
const Match = require("../models/match");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

// Create a new bracket
router.post("/brackets", (req, res) => {
  const { tournamentId } = req.body;
  const newBracket = new Bracket(tournamentId);
  newBracket.save(db, (err, bracketId) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating bracket", error: err });
    }
    return res
      .status(201)
      .json({ message: "Bracket created successfully!", bracketId });
  });
});

// Link matches to a bracket
router.post("/brackets/:id/matches", (req, res) => {
  const bracketId = req.params.id;
  const { matchIds } = req.body;

  // Validate match IDs before linking
  const matchPromises = matchIds.map((id) => {
    return new Promise((resolve, reject) => {
      Match.findById(db, id, (err, match) => {
        if (err || !match) {
          return reject(new Error(`Match with ID ${id} does not exist`));
        }
        resolve();
      });
    });
  });

  Promise.all(matchPromises)
    .then(() => {
      Bracket.linkMatches(db, bracketId, matchIds, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error linking matches to bracket", error: err });
        }
        return res.json({ message: "Matches linked to bracket successfully!" });
      });
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Get bracket by tournament ID
router.get("/brackets/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;
  Bracket.findByTournamentId(db, tournamentId, (err, bracket) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching bracket", error: err });
    }
    return res.json(bracket);
  });
});

// Update a bracket
router.put("/brackets/:id", (req, res) => {
  const bracketId = req.params.id;
  const { tournamentId } = req.body;
  Bracket.update(db, bracketId, { tournamentId }, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating bracket", error: err });
    }
    return res.json({ message: "Bracket updated successfully!" });
  });
});

// Delete a bracket
router.delete("/brackets/:id", (req, res) => {
  const bracketId = req.params.id;
  Bracket.delete(db, bracketId, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting bracket", error: err });
    }
    return res.json({ message: "Bracket deleted successfully!" });
  });
});

module.exports = router;

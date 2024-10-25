// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const Match = require("../models/match");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

// Create a new match
router.post("/matches", (req, res) => {
  const { tournamentId, participant1, participant2, winner } = req.body;
  const newMatch = new Match(tournamentId, participant1, participant2, winner);
  newMatch.save(db, (err, matchId) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating match", error: err });
    }
    return res
      .status(201)
      .json({ message: "Match created successfully!", id: matchId });
  });
});

// Get all matches for a tournament
router.get("/matches/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;
  Match.findByTournamentId(db, tournamentId, (err, matches) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching matches", error: err });
    }
    return res.json(matches);
  });
});

// Update match details
router.put("/matches/:id", (req, res) => {
  const matchId = req.params.id;
  const { participant1, participant2, winner } = req.body;
  Match.update(db, matchId, { participant1, participant2, winner }, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating match", error: err });
    }
    return res.json({ message: "Match updated successfully!" });
  });
});

// Delete a match
router.delete("/matches/:id", (req, res) => {
  const matchId = req.params.id;
  Match.delete(db, matchId, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting match", error: err });
    }
    return res.json({ message: "Match deleted successfully!" });
  });
});

module.exports = router;

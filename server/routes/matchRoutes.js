// routes/matchRoutes.js
const express = require("express");
const router = express.Router();
const Matches = require("../models/match");
const path = require("path");
const db = require("../db");

// Create a new match
router.post("/matches", (req, res) => {
  const {
    bracketId,
    roundNumber,
    matchNumber,
    participant1Id,
    participant2Id,
  } = req.body;

  const match = new Matches(
    bracketId,
    roundNumber,
    matchNumber,
    participant1Id,
    participant2Id,
    null,
    null
  );

  match.save(db, (err, lastId) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating match", error: err });
    }
    return res
      .status(201)
      .json({ message: "Match created successfully!", id: lastId });
  });
});

// Declare a winner of the match
router.post("/matches/declare-winner", async (req, res) => {
  const {
    matchId,
    winnerId,
    loserId,
    isLosersBracket,
    bracketId,
    roundNumber,
  } = req.body;

  try {
    await Matches.handleMatchResult(
      db,
      matchId,
      winnerId,
      loserId,
      isLosersBracket,
      bracketId,
      roundNumber
    );
    res.status(200).json({ message: "Match result updated successfully." });
  } catch (error) {
    console.error("Error updating match result:", error);
    res.status(500).json({ message: "Failed to update match result." });
  }
});

// Get all matches for a specific bracket
router.get("/matches/:bracketId", (req, res) => {
  const { bracketId } = req.params;
  Matches.findByBracketId(db, bracketId, (err, matches) => {
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
  const {
    bracketId,
    roundNumber,
    matchNumber,
    participant1Id,
    participant2Id,
    winnerId,
    loserId,
  } = req.body;

  const updates = {
    bracketId,
    roundNumber,
    matchNumber,
    participant1Id,
    participant2Id,
    winnerId,
    loserId,
  };

  Matches.update(db, matchId, updates, (err) => {
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
  Matches.delete(db, matchId, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting match", error: err });
    }
    return res.json({ message: "Match deleted successfully!" });
  });
});

module.exports = router;

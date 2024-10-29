// routes/bracketRoutes.js
const express = require("express");
const router = express.Router();
const Bracket = require("../models/brackets");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

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

  // Validate required fields
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

module.exports = router;

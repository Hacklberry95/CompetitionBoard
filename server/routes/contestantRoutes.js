// routes/contestantRoutes.js
const express = require("express");
const router = express.Router();
const Contestant = require("../models/contestant");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

// Create a new contestant
router.post("/contestants", (req, res) => {
  const { fullName, tournamentId } = req.body;

  // Validate input
  if (!fullName || !tournamentId) {
    return res
      .status(400)
      .json({ message: "fullName and tournamentId are required." });
  }

  const newContestant = new Contestant(fullName, tournamentId);
  newContestant.save(db, (err) => {
    if (err) {
      console.error("Error adding contestant:", err.message);
      return res
        .status(500)
        .json({ message: "Error adding contestant", error: err });
    }
    return res.status(201).json({
      message: "Contestant added successfully!",
      fullName,
      tournamentId,
    });
  });
});

// Get all contestants for a specific tournament
router.get("/contestants/tournament/:tournamentId", (req, res) => {
  const { tournamentId } = req.params;

  Contestant.findByTournamentId(db, tournamentId, (err, contestants) => {
    if (err) {
      console.error("Error fetching contestants:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching contestants", error: err });
    }
    return res.json(contestants);
  });
});

// Update a contestant
router.put("/contestants/:id", (req, res) => {
  const { id } = req.params;
  const { fullName, tournamentId } = req.body;

  if (!fullName) {
    return res.status(400).json({ message: "fullName is required." });
  }

  Contestant.update(db, id, { fullName, tournamentId }, (err) => {
    if (err) {
      console.error("Error updating contestant:", err.message);
      return res
        .status(500)
        .json({ message: "Error updating contestant", error: err });
    }
    return res.json({ message: "Contestant updated successfully!" });
  });
});

// Delete a contestant
router.delete("/contestants/:id", (req, res) => {
  const { id } = req.params;

  Contestant.delete(db, id, (err) => {
    if (err) {
      console.error("Error deleting contestant:", err.message);
      return res
        .status(500)
        .json({ message: "Error deleting contestant", error: err });
    }
    return res.json({ message: "Contestant deleted successfully!" });
  });
});

// Delete a contestant by tournamentId and contestantId
router.delete("/contestants/:tournamentId/:contestantId", (req, res) => {
  const { tournamentId, contestantId } = req.params;

  // Optionally validate tournamentId and contestantId if needed

  Contestant.deleteById(db, contestantId, tournamentId, (err, message) => {
    if (err) {
      console.error("Error deleting contestant:", err.message);
      return res
        .status(500)
        .json({ message: "Error deleting contestant", error: err.message });
    }
    return res.json({ message });
  });
});

module.exports = router;

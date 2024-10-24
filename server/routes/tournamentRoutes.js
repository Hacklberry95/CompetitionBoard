const express = require("express");
const router = express.Router();
const tournament = require("../models/tournament");
const path = require("path");

// Use the correct database path
const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

// Create a new tournament
router.post("/tournaments", (req, res) => {
  const { name, date, location } = req.body;
  const newTournament = new tournament(name, date, location);
  newTournament.save(db, (err) => {
    // Pass db instance here
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating tournament", error: err });
    }
    return res
      .status(201)
      .json({ message: "Tournament created successfully!" });
  });
});

// Get all tournaments
router.get("/tournaments", (req, res) => {
  tournament.findAll(db, (err, tournaments) => {
    // Pass db instance here
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching tournaments", error: err });
    }
    return res.json(tournaments);
  });
});

// Get a single tournament by ID
router.get("/tournaments/:id", (req, res) => {
  const tournamentId = req.params.id;
  tournament.findById(db, tournamentId, (err, tournament) => {
    // Pass db instance here
    if (err) {
      return res
        .status(500)
        .json({ message: "Error fetching tournament", error: err });
    }
    return res.json(tournament);
  });
});

// Update a tournament by ID
router.put("/tournaments/:id", (req, res) => {
  const tournamentId = req.params.id;
  const { name, date, location } = req.body;
  tournament.update(db, tournamentId, { name, date, location }, (err) => {
    // Pass db instance here
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating tournament", error: err });
    }
    return res.json({ message: "Tournament updated successfully!" });
  });
});

// Delete a tournament by ID
router.delete("/tournaments/:id", (req, res) => {
  const tournamentId = req.params.id;
  tournament.delete(db, tournamentId, (err) => {
    // Pass db instance here
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting tournament", error: err });
    }
    return res.json({ message: "Tournament deleted successfully!" });
  });
});

module.exports = router;

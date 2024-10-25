// routes/tournamentRoutes.js
const express = require("express");
const router = express.Router();
const Tournament = require("../models/tournament");
const path = require("path");

const dbPath = path.join(__dirname, "../../db/tournament.db");
const db = new (require("sqlite3").verbose().Database)(dbPath);

// Create a new tournament
router.post("/tournaments", (req, res) => {
  const { name, date, location } = req.body;
  const newTournament = new Tournament(name, date, location);
  newTournament.save(db, (err, tournamentId) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating tournament", error: err });
    }
    return res
      .status(201)
      .json({ message: "Tournament created successfully!", id: tournamentId });
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

module.exports = router;

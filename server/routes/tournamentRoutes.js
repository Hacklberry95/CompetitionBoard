const express = require("express");
const router = express.Router();
const Tournament = require("../models/Tournament");

// Create a new tournament
router.post("/tournaments", (req, res) => {
  const { name, date, location } = req.body;
  const newTournament = new Tournament(name, date, location);
  newTournament.save((err) => {
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
  Tournament.findAll((err, tournaments) => {
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
  Tournament.findById(tournamentId, (err, tournament) => {
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
  Tournament.update(tournamentId, { name, date, location }, (err) => {
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
  Tournament.delete(tournamentId, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error deleting tournament", error: err });
    }
    return res.json({ message: "Tournament deleted successfully!" });
  });
});

module.exports = router;

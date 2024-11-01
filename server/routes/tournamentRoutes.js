// routes/tournamentRoutes.js
const express = require("express");
const router = express.Router();
const Tournament = require("../models/tournament");
const db = require("../db");

// Create a new tournament
router.post("/tournaments", async (req, res) => {
  try {
    const { Name, Date, Location } = req.body;
    const newTournament = new Tournament(Name, Date, Location);

    const id = await newTournament.save(db);
    res.status(201).json({
      message: "Tournament created successfully!",
      id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating tournament", error });
  }
});

// Get all tournaments
router.get("/tournaments", async (req, res) => {
  try {
    const tournaments = await Tournament.findAll(db);
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tournaments", error });
  }
});

// Get a tournament by ID
router.get("/tournaments/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(db, req.params.id);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tournament", error });
  }
});

// Update a tournament
router.put("/tournaments/:id", async (req, res) => {
  try {
    const { name, date, location } = req.body;
    await Tournament.update(db, req.params.id, { name, date, location });
    res.json({ message: "Tournament updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating tournament", error });
  }
});

// Delete a tournament
router.delete("/tournaments/:id", async (req, res) => {
  try {
    await Tournament.delete(db, req.params.id);
    res.json({ message: "Tournament deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tournament", error });
  }
});

module.exports = router;

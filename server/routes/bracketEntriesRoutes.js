// routes/bracketEntryRoutes.js
const express = require("express");
const router = express.Router();
const BracketEntry = require("../models/bracketEntries");
const path = require("path");
const db = require("../db");

// Get all bracket entries
router.get("/bracketEntries", (req, res) => {
  BracketEntry.findAll(db, (err, entries) => {
    if (err) {
      console.error("Error fetching bracket entries:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching bracket entries", error: err });
    }
    return res.json(entries);
  });
});

// Get a bracket entry by its ID
router.get("/bracketEntries/:id", (req, res) => {
  const { id } = req.params;

  BracketEntry.findById(db, id, (err, entry) => {
    if (err) {
      console.error("Error fetching bracket entry:", err.message);
      return res
        .status(500)
        .json({ message: "Error fetching bracket entry", error: err });
    }
    if (!entry) {
      return res.status(404).json({ message: "Bracket entry not found" });
    }
    return res.json(entry);
  });
});

// Create a new bracket entry
router.post("/bracketEntries", (req, res) => {
  const { bracketId, participantId } = req.body;

  if (!bracketId || !participantId) {
    return res
      .status(400)
      .json({ message: "Both bracketId and participantId are required." });
  }

  const bracketEntry = new BracketEntry(bracketId, participantId);
  bracketEntry.save(db, (err) => {
    if (err) {
      console.error("Error creating bracket entry:", err.message);
      return res
        .status(500)
        .json({ message: "Error creating bracket entry", error: err });
    }
    return res
      .status(201)
      .json({ message: "Bracket entry created successfully!" });
  });
});

// Update a bracket entry
router.put("/bracketEntries/:id", (req, res) => {
  const { id } = req.params;
  const { bracketId, participantId } = req.body;

  if (!bracketId || !participantId) {
    return res.status(400).json({
      message: "Both bracketId and participantId are required for update.",
    });
  }

  BracketEntry.update(db, id, { bracketId, participantId }, (err) => {
    if (err) {
      console.error("Error updating bracket entry:", err.message);
      return res
        .status(500)
        .json({ message: "Error updating bracket entry", error: err });
    }
    return res.json({ message: "Bracket entry updated successfully!" });
  });
});

// Delete a bracket entry by ID
router.delete("/bracketEntries/:id", (req, res) => {
  const { id } = req.params;

  BracketEntry.delete(db, id, (err) => {
    if (err) {
      console.error("Error deleting bracket entry:", err.message);
      return res
        .status(500)
        .json({ message: "Error deleting bracket entry", error: err });
    }
    return res.json({ message: "Bracket entry deleted successfully!" });
  });
});

// Delete all entries for a specific bracket
router.delete("/bracketEntries/bracket/:bracketId", (req, res) => {
  const { bracketId } = req.params;

  BracketEntry.deleteByBracketId(db, bracketId, (err) => {
    if (err) {
      console.error(
        "Error deleting bracket entries by bracketId:",
        err.message
      );
      return res.status(500).json({
        message: "Error deleting bracket entries by bracketId",
        error: err,
      });
    }
    return res.json({ message: "Bracket entries deleted successfully!" });
  });
});

// Get all entries for a specific bracket
router.get("/bracketEntries/bracket/:bracketId", (req, res) => {
  const { bracketId } = req.params;

  BracketEntry.findByBracketId(db, bracketId, (err, entries) => {
    if (err) {
      console.error(
        "Error fetching bracket entries by bracketId:",
        err.message
      );
      return res.status(500).json({
        message: "Error fetching bracket entries by bracketId",
        error: err,
      });
    }
    return res.json(entries);
  });
});

// Get all entries for a specific participant
router.get("/bracketEntries/participant/:participantId", (req, res) => {
  const { participantId } = req.params;

  BracketEntry.findByParticipantId(db, participantId, (err, entries) => {
    if (err) {
      console.error(
        "Error fetching bracket entries by participantId:",
        err.message
      );
      return res.status(500).json({
        message: "Error fetching bracket entries by participantId",
        error: err,
      });
    }
    return res.json(entries);
  });
});

module.exports = router;

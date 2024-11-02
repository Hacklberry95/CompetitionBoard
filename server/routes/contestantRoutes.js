// routes/contestantRoutes.js
const express = require("express");
const router = express.Router();
const Contestant = require("../models/contestant");
const db = require("../db");

// Get all contestants for a specific tournament
router.get("/contestants/tournament/:tournamentId", async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const contestants = await Contestant.findByTournamentId(db, tournamentId);

    if (contestants.length === 0) {
      return res.status(404).json({ message: "No contestants found" });
    }

    return res.json(contestants);
  } catch (err) {
    console.error("Error fetching contestants:", err.message);
    return res
      .status(500)
      .json({ message: "Error fetching contestants", error: err });
  }
});

// Get contestant by Id
router.get("/contestants/:id", (req, res) => {
  const { id } = req.params;

  Contestant.findById(db, id, (err, entry) => {
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

// Update a contestant
router.put("/contestants/:id", (req, res) => {
  const { id } = req.params;
  const { name, tournamentId, gender, weightKg, armPreference, division } =
    req.body;

  // Ensure all required fields are provided in the update payload
  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }

  Contestant.update(
    db,
    id,
    { tournamentId, name, gender, weightKg, armPreference, division },
    (err) => {
      if (err) {
        console.error("Error updating contestant:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating contestant", error: err });
      }
      return res.json({ message: "Contestant updated successfully!" });
    }
  );
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

// Add a contestant to a tournament
router.post("/contestants/:tournamentId/contestants", (req, res) => {
  const { tournamentId } = req.params;
  const { Name, Gender, WeightKg, ArmPreference, Division } = req.body;

  const newContestant = new Contestant(
    tournamentId,
    Name,
    Gender,
    WeightKg,
    ArmPreference,
    Division
  );

  // Save the contestant to the database
  newContestant.save(db, (err, lastId) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding contestant", error: err });
    }
    console.log("Last ID from save method:", lastId); // Log the last ID
    const responseContestant = {
      id: lastId,
      TournamentId: tournamentId,
      Name,
      Gender,
      WeightKg,
      ArmPreference,
      Division,
    };
    console.log(responseContestant);
    return res.status(201).json(responseContestant);
  });
});

// contestantRoutes.js
router.delete("/contestants/:tournamentId/:contestantId", async (req, res) => {
  const { tournamentId, contestantId } = req.params;
  console.log("Delete request received for:", { tournamentId, contestantId });

  try {
    const contestants = await Contestant.findByTournamentId(db, tournamentId);
    const contestant = contestants.find(
      (c) => c.id === parseInt(contestantId, 10)
    );

    if (!contestant) {
      return res.status(404).json({ message: "Contestant not found." });
    }

    // Proceed with deletion
    const result = await Contestant.delete(db, contestantId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting contestant:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting contestant", error: error.message });
  }
});

module.exports = router;

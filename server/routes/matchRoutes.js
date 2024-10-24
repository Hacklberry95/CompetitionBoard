const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Create a new match
router.post('/matches', (req, res) => {
    const { tournamentId, participant1, participant2, winner } = req.body;
    const newMatch = new Match(tournamentId, participant1, participant2, winner);
    newMatch.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating match', error: err });
        }
        return res.status(201).json({ message: 'Match created successfully!' });
    });
});

// Get all matches for a tournament
router.get('/matches/:tournamentId', (req, res) => {
    const { tournamentId } = req.params;
    Match.findByTournamentId(tournamentId, (err, matches) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching matches', error: err });
        }
        return res.json(matches);
    });
});

// Update match details
router.put('/matches/:id', (req, res) => {
    const matchId = req.params.id;
    const { participant1, participant2, winner } = req.body;
    Match.update(matchId, { participant1, participant2, winner }, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating match', error: err });
        }
        return res.json({ message: 'Match updated successfully!' });
    });
});

// Delete a match
router.delete('/matches/:id', (req, res) => {
    const matchId = req.params.id;
    Match.delete(matchId, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting match', error: err });
        }
        return res.json({ message: 'Match deleted successfully!' });
    });
});

module.exports = router;

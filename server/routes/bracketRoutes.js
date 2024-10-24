const express = require('express');
const router = express.Router();
const Bracket = require('../models/Bracket');

// Create a new bracket
router.post('/brackets', (req, res) => {
    const { tournamentId, rounds } = req.body;
    const newBracket = new Bracket(tournamentId, rounds);
    newBracket.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating bracket', error: err });
        }
        return res.status(201).json({ message: 'Bracket created successfully!' });
    });
});

// Get bracket by tournament ID
router.get('/brackets/:tournamentId', (req, res) => {
    const { tournamentId } = req.params;
    Bracket.findByTournamentId(tournamentId, (err, bracket) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching bracket', error: err });
        }
        return res.json(bracket);
    });
});

// Update a bracket
router.put('/brackets/:id', (req, res) => {
    const bracketId = req.params.id;
    const { rounds } = req.body;
    Bracket.update(bracketId, { rounds }, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating bracket', error: err });
        }
        return res.json({ message: 'Bracket updated successfully!' });
    });
});

// Delete a bracket
router.delete('/brackets/:id', (req, res) => {
    const bracketId = req.params.id;
    Bracket.delete(bracketId, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting bracket', error: err });
        }
        return res.json({ message: 'Bracket deleted successfully!' });
    });
});

module.exports = router;

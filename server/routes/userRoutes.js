const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/users', (req, res) => {
    const { name } = req.body;
    const newUser = new User(name);
    newUser.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating user', error: err });
        }
        return res.status(201).json({ message: 'User created successfully!' });
    });
});

// Get all users
router.get('/users', (req, res) => {
    User.findAll((err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users', error: err });
        }
        return res.json(users);
    });
});

// Get a single user by ID
router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching user', error: err });
        }
        return res.json(user);
    });
});

// Update user details
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name } = req.body;
    User.update(userId, { name }, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating user', error: err });
        }
        return res.json({ message: 'User updated successfully!' });
    });
});

// Delete a user
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    User.delete(userId, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user', error: err });
        }
        return res.json({ message: 'User deleted successfully!' });
    });
});

module.exports = router;

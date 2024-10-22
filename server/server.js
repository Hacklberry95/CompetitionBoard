const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000; // Change port if needed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./server/db/tournament.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the tournament database.');
    }
});

// Basic API route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the Tournament API!' });
});

// Example API to fetch competitors from the DB
app.get('/api/competitors', (req, res) => {
    db.all('SELECT * FROM competitors', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

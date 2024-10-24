const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');
const port = 5000;

// Import Models
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const Match = require('./models/Match');
const Bracket = require('./models/Bracket');

// Middleware
app.use(cors());
app.use(express.json());

// Use the correct database path
const dbPath = path.resolve(__dirname, '../db/tournament.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the tournament database.');
    }
});

// Initialize database tables
User.createTable(db);
Tournament.createTable(db);
Match.createTable(db);
Bracket.createTable(db);

// Import API routes
const userRoutes = require('./routes/userRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const matchRoutes = require('./routes/matchRoutes');
const bracketRoutes = require('./routes/bracketRoutes');

// Use API routes
app.use('/api', userRoutes);
app.use('/api', tournamentRoutes);
app.use('/api', matchRoutes);
app.use('/api', bracketRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

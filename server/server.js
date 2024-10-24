const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const path = require("path");
const port = 5000;

// Importing Models
const tournament = require("./models/tournament");
const match = require("./models/match");
const bracket = require("./models/bracket");

// Middleware
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "../db/tournament.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the tournament database.");

    // Initializing database
    tournament.createTable(db);
    match.createTable(db);
    bracket.createTable(db);
  }
});

// Import API routes
const tournamentRoutes = require("./routes/tournamentRoutes");
const matchRoutes = require("./routes/matchRoutes");
const bracketRoutes = require("./routes/bracketRoutes");

// Using API routes
app.use("/api", tournamentRoutes);
app.use("/api", matchRoutes);
app.use("/api", bracketRoutes);

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

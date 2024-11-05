// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;

// Import the shared db instance from db.js
const db = require("./db");

// Importing Models
const Tournament = require("./models/tournament");
const Match = require("./models/match");
const Contestant = require("./models/contestant");
const Brackets = require("./models/brackets");
const BracketEntries = require("./models/bracketEntries");

// Middleware
app.use(cors());
app.use(express.json());

// Enable foreign keys and create tables
db.run("PRAGMA foreign_keys = ON", (pragmaErr) => {
  if (pragmaErr) {
    console.error("Error enabling foreign keys:", pragmaErr.message);
  } else {
    console.log("Foreign keys are enabled.");

    // Create tables using the shared db instance
    Tournament.createTable(db);
    Match.createTable(db);
    Contestant.createTable(db);
    Brackets.createTable(db);
    BracketEntries.createTable(db);
  }
});

// Import and use routes
const bracketEntries = require("./routes/bracketEntriesRoutes");
const brackets = require("./routes/bracketsRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const contestantRoutes = require("./routes/contestantRoutes");
const matchRoutes = require("./routes/matchRoutes");

app.use("/api", tournamentRoutes);
app.use("/api", contestantRoutes);
app.use("/api", matchRoutes);
app.use("/api", brackets);
app.use("/api", bracketEntries);

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down the server...");

  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }

    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

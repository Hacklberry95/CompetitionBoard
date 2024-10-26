const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const http = require("http");
const path = require("path");
const port = 5000;

// Importing Models
const Tournament = require("./models/tournament");
const Match = require("./models/match");
const Bracket = require("./models/bracket");
const BracketMatches = require("./models/bracket_matches");
const Contestant = require("./models/contestant");

// Middleware
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "../db/tournament.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the tournament database.");

    db.run("PRAGMA foreign_keys = ON", (pragmaErr) => {
      if (pragmaErr) {
        console.error("Error enabling foreign keys:", pragmaErr.message);
      } else {
        console.log("Foreign keys are enabled.");

        Tournament.createTable(db);
        Match.createTable(db);
        Bracket.createTable(db);
        BracketMatches.createTable(db);
        Contestant.createTable(db);
      }
    });
  }
});

const tournamentRoutes = require("./routes/tournamentRoutes");
const matchRoutes = require("./routes/matchRoutes");
const bracketRoutes = require("./routes/bracketRoutes");
const contestantRoutes = require("./routes/contestantRoutes");

app.use("/api", tournamentRoutes);
app.use("/api", matchRoutes);
app.use("/api", bracketRoutes);
app.use("/api", contestantRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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

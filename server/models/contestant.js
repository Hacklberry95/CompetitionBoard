// models/Participants.js
// TODO: Refactor all of the models so they fit what I have in the frontend.
class Contestant {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS Contestants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        TournamentId INTEGER,
        Name TEXT,
        Gender TEXT,
        WeightKg REAL,
        ArmPreference TEXT,
        Division TEXT,
        FOREIGN KEY (TournamentId) REFERENCES Tournaments(id)
      );
    `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating contestants table:", err.message);
      } else {
        console.log("Contestants table created.");
      }
    });
  }

  constructor(tournamentId, name, gender, weightKg, armPreference, division) {
    this.tournamentId = tournamentId;
    this.name = name;
    this.gender = gender;
    this.weightKg = weightKg;
    this.armPreference = armPreference;
    this.division = division;
  }

  save(db, callback) {
    const query = `
      INSERT INTO Contestants (TournamentId, Name, Gender, WeightKg, ArmPreference, Division)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    db.run(
      query,
      [
        this.tournamentId,
        this.name,
        this.gender,
        this.weightKg,
        this.armPreference,
        this.division,
      ],
      function (err) {
        callback(err, this.lastID);
      }
    );
  }

  static findAll(db, callback) {
    const query = `SELECT * FROM Contestants;`;
    db.all(query, [], callback);
  }

  static findById(db, id, callback) {
    const query = `SELECT * FROM Contestants WHERE id = ?;`;
    db.get(query, [id], callback);
  }

  static update(
    db,
    id,
    { tournamentId, name, gender, weightKg, armPreference, division },
    callback
  ) {
    const query = `
      UPDATE Contestants
      SET TournamentId = ?, Name = ?, Gender = ?, WeightKg = ?, ArmPreference = ?, Division = ?
      WHERE id = ?;
    `;
    db.run(
      query,
      [tournamentId, name, gender, weightKg, armPreference, division, id],
      function (err) {
        callback(err);
      }
    );
  }

  static delete(db, id, callback) {
    const query = `DELETE FROM Contestants WHERE id = ?;`;
    db.run(query, [id], function (err) {
      callback(err);
    });
  }

  static findByTournamentId(db, tournamentId) {
    const query = `SELECT * FROM Contestants WHERE TournamentId = ?`;
    console.log(`Querying contestants for TournamentId: ${tournamentId}`);

    return new Promise((resolve, reject) => {
      db.all(query, [tournamentId], (err, rows) => {
        if (err) {
          console.error(
            "Error finding contestants by tournament ID:",
            err.message
          );
          reject(err);
        } else {
          console.log(
            `Found ${rows.length} contestants for tournament ${tournamentId}`
          );
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Contestant;

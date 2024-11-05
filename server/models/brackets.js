// models/Brackets.js
class Brackets {
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS Brackets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        TournamentId INTEGER,
        Division TEXT,
        Gender TEXT CHECK(Gender IN ('M', 'F')),
        Arm TEXT CHECK(Arm IN ('R', 'L', 'B')),
        WeightClass TEXT,
        FOREIGN KEY (TournamentId) REFERENCES Tournaments(id)
      );
    `;
    db.run(query, (err) => {
      if (err) {
        console.error("Error creating Brackets table:", err.message);
      } else {
        console.log("Brackets table created.");
      }
    });
  }

  constructor(tournamentId, division, gender, arm, weightClass) {
    this.tournamentId = tournamentId;
    this.division = division;
    this.gender = gender;
    this.arm = arm;
    this.weightClass = weightClass;
  }

  save(db, callback) {
    const query = `
      INSERT INTO Brackets (TournamentId, Division, Gender, Arm, WeightClass)
      VALUES (?, ?, ?, ?, ?);
    `;
    db.run(
      query,
      [
        this.tournamentId,
        this.division,
        this.gender,
        this.arm,
        this.weightClass,
      ],
      function (err) {
        callback(err, this.lastId);
      }
    );
  }
  static create(
    db,
    tournamentId,
    division,
    gender,
    arm,
    weightClass,
    callback
  ) {
    const query = `
      INSERT INTO Brackets (TournamentId, Division, Gender, Arm, WeightClass)
      VALUES (?, ?, ?, ?, ?);
    `;

    return new Promise((resolve, reject) => {
      db.run(
        query,
        [tournamentId, division, gender, arm, weightClass],
        function (err) {
          if (err) {
            console.error("Error creating bracket:", err.message);
            if (callback) callback(err);
            return reject(err);
          }

          const lastId = this.lastID;
          console.log("Created bracket with ID:", lastId);

          if (callback) {
            callback(null, lastId);
          } else {
            resolve(lastId);
          }
        }
      );
    });
  }

  static findAll(db, callback) {
    const query = `SELECT * FROM Brackets;`;
    db.all(query, [], callback);
  }

  static findById(db, id, callback) {
    const query = `SELECT * FROM Brackets WHERE id = ?;`;
    db.get(query, [id], callback);
  }

  static update(
    db,
    id,
    { tournamentID, division, gender, arm, weightClass },
    callback
  ) {
    const query = `
      UPDATE Brackets
      SET TournamentId = ?, Division = ?, Gender = ?, Arm = ?, WeightClass = ?
      WHERE id = ?;
    `;
    db.run(
      query,
      [tournamentID, division, gender, arm, weightClass, id],
      function (err) {
        callback(err);
      }
    );
  }

  static delete(db, id, callback) {
    const query = `DELETE FROM Brackets WHERE id = ?;`;
    db.run(query, [id], function (err) {
      callback(err);
    });
  }

  static findByTournamentId(db, tournamentID, callback) {
    const query = `SELECT * FROM Brackets WHERE TournamentId = ?;`;
    db.all(query, [tournamentID], callback);
  }

  static deleteAll(db, tournamentId) {
    const query = `DELETE FROM Brackets WHERE tournamentId = ?;`;

    return new Promise((resolve, reject) => {
      db.run(query, [tournamentId], function (err) {
        if (err) {
          console.error("Error deleting brackets for tournament:", err.message);
          return reject(err);
        }
        console.log("Brackets for tournament deleted successfully.");
        resolve();
      });
    });
  }
}

module.exports = Brackets;

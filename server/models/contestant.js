class Contestant {
  // Create the contestants table with new fields
  static createTable(db) {
    const query = `
      CREATE TABLE IF NOT EXISTS contestants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        gender TEXT,                   
        arm TEXT,                       
        tournamentId INTEGER,
        weightCategory TEXT,            
        division TEXT,           
        FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
      );
    `;
    db.run(query);
  }

  constructor(fullName, tournamentId, gender, arm, weightCategory, division) {
    this.fullName = fullName;
    this.tournamentId = tournamentId;
    this.gender = gender;
    this.arm = arm;
    this.weightCategory = weightCategory;
    this.division = division;
  }

  // Update the save method to include all new fields
  save(db, callback) {
    const query = `
      INSERT INTO contestants (fullName, tournamentId, gender, arm, weightCategory, division)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    db.run(
      query,
      [
        this.fullName,
        this.tournamentId,
        this.gender,
        this.arm,
        this.weightCategory,
        this.division,
      ],
      callback
    );
  }

  static findByTournamentId(db, tournamentId, callback) {
    db.all(
      `SELECT * FROM contestants WHERE tournamentId = ?;`,
      [tournamentId],
      callback
    );
  }

  // Update the update method to allow updating all relevant fields
  static update(
    db,
    id,
    { fullName, gender, arm, weightCategory, division },
    callback
  ) {
    db.run(
      `UPDATE contestants SET fullName = ?, gender = ?, arm = ?, weightCategory = ?, division = ? WHERE id = ?;`,
      [fullName, gender, arm, weightCategory, division, id],
      callback
    );
  }

  static delete(db, id, callback) {
    db.run(`DELETE FROM contestants WHERE id = ?;`, [id], callback);
  }

  static deleteById(db, id, tournamentId, callback) {
    // First, check if a contestant with the given ID exists for the specified tournament
    db.get(
      `SELECT * FROM contestants WHERE id = ? AND tournamentId = ?;`,
      [id, tournamentId],
      (err, row) => {
        if (err) {
          return callback(err);
        }
        if (!row) {
          return callback(
            new Error(
              `Contestant with ID ${id} not found in tournament ${tournamentId}.`
            )
          );
        }

        // If contestant exists, delete it
        db.run(
          `DELETE FROM contestants WHERE id = ? AND tournamentId = ?;`,
          [id, tournamentId],
          (err) => {
            if (err) {
              return callback(err);
            }
            callback(
              null,
              `Contestant with ID ${id} deleted from tournament ${tournamentId}.`
            );
          }
        );
      }
    );
  }
}

module.exports = Contestant;

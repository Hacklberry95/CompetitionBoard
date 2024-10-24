class Match {
    static createTable(db) {
        const query = `
            CREATE TABLE IF NOT EXISTS matches (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tournamentId INTEGER,
                participant1 TEXT,
                participant2 TEXT,
                winner TEXT,
                FOREIGN KEY (tournamentId) REFERENCES tournaments(id)
            );
        `;
        db.run(query, (err) => {
            if (err) {
                console.error('Error creating matches table:', err.message);
            } else {
                console.log('Matches table created.');
            }
        });
    }

    constructor(tournamentId, participant1, participant2, winner) {
        this.tournamentId = tournamentId;
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.winner = winner;
    }

    save(db, callback) {
        const query = `
            INSERT INTO matches (tournamentId, participant1, participant2, winner)
            VALUES (?, ?, ?, ?);
        `;
        db.run(query, [this.tournamentId, this.participant1, this.participant2, this.winner], callback);
    }

    static findByTournamentId(db, tournamentId, callback) {
        const query = `
            SELECT * FROM matches WHERE tournamentId = ?;
        `;
        db.all(query, [tournamentId], callback);
    }
}

module.exports = Match;

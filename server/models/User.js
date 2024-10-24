class User {
    static createTable(db) {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT
            );
        `;
        db.run(query, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table created.');
            }
        });
    }

    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    save(db, callback) {
        const query = `
            INSERT INTO users (name, email)
            VALUES (?, ?);
        `;
        db.run(query, [this.name, this.email], callback);
    }

    static findAll(db, callback) {
        const query = `SELECT * FROM users;`;
        db.all(query, [], callback);
    }
}

module.exports = User;

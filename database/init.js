const db = require("./db");

db.serialize(() => {

    // Activities table
    db.run(`
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            activity_date TEXT NOT NULL,
            start_time TEXT,
            end_time TEXT,
            project TEXT,
            department TEXT,
            activity TEXT NOT NULL,
            description TEXT,
            duration INTEGER,
            status TEXT DEFAULT 'Completed',
            remarks TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tasks table
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            priority TEXT,
            deadline TEXT,
            status TEXT DEFAULT 'Pending',
            assigned_by TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME
        )
    `);

});
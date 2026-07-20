const db = require("./db");

db.serialize(() => {
  // ===========================
  // Users
  // ===========================
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Employee',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ===========================
  // Departments
  // ===========================
  db.run(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      manager TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // ===========================
  // Projects
  // ===========================
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      client TEXT,
      description TEXT,
      color TEXT DEFAULT '#2563eb',
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'Active',
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // ===========================
  // Activities
  // ===========================
  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      department_id INTEGER NOT NULL,

      date TEXT NOT NULL,
      start_time TEXT,
      end_time TEXT,

      category TEXT DEFAULT 'General',
      activity TEXT NOT NULL,
      description TEXT,
      duration INTEGER,
      status TEXT DEFAULT 'Pending',

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,

      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);

  // ===========================
  // Tasks
  // ===========================
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      department_id INTEGER NOT NULL,

      title TEXT NOT NULL,
      description TEXT,

      priority TEXT DEFAULT 'Medium',
      status TEXT DEFAULT 'Pending',
      due_date DATE,

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );
  `);
  // ===========================
  // Centers
  // ===========================
  db.run(`
CREATE TABLE IF NOT EXISTS centers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    acronym TEXT NOT NULL,
    details TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);
  // ===========================
  // Stations
  // ===========================



db.run(`
CREATE TABLE IF NOT EXISTS stations (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL UNIQUE,

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP

);
`);
  // ===========================
  // Center Station Assignments
  // ===========================



db.run(`
CREATE TABLE IF NOT EXISTS center_station_assignments (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    center_id INTEGER NOT NULL,

    station_id INTEGER NOT NULL,

    protocol TEXT NOT NULL,

    FOREIGN KEY(center_id)
        REFERENCES centers(id)
        ON DELETE CASCADE,

    FOREIGN KEY(station_id)
        REFERENCES stations(id)
        ON DELETE CASCADE,

    UNIQUE(center_id, station_id)

);
`);
  // ===========================
  // Hardware
  // ===========================

  db.run(`
CREATE TABLE IF NOT EXISTS hardware (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    center_id INTEGER NOT NULL,

    type TEXT NOT NULL,

    brand TEXT,

    model TEXT,

    quantity INTEGER DEFAULT 1,

    serial_number TEXT,

    ip_address TEXT,

    status TEXT DEFAULT 'Operational',

    notes TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(center_id)
        REFERENCES centers(id)
        ON DELETE CASCADE

);
`);
});

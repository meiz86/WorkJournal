const db = require("../database/db");

// ============================
// List All Centers
// ============================

exports.getAll = (callback) => {
  const sql = `
        SELECT
            id,
            name,
            acronym

        FROM centers

        ORDER BY name
    `;

  db.all(sql, callback);
};

// ============================
// Get Center By ID
// ============================

exports.getById = (id, callback) => {
  const sql = `
        SELECT
            id,
            name,
            acronym

        FROM centers

        WHERE id = ?
    `;

  db.get(sql, [id], callback);
};

// ============================
// Create Center
// ============================

exports.create = (data, callback) => {
  const sql = `
        INSERT INTO centers
        (
            name,
            acronym
        )

        VALUES (?, ?)
    `;

  db.run(sql, [data.name, data.acronym], callback);
};

// ============================
// Update Center
// ============================

exports.update = (id, data, callback) => {
  const sql = `
        UPDATE centers

        SET

            name = ?,
            acronym = ?

        WHERE id = ?
    `;

  db.run(sql, [data.name, data.acronym, id], callback);
};

// ============================
// Delete Center
// ============================

exports.remove = (id, callback) => {
  const sql = `
        DELETE FROM centers

        WHERE id = ?
    `;

  db.run(sql, [id], callback);
};

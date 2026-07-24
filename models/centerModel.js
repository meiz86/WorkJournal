const db = require("../database/db");

// ============================
// Get All Centers
// ============================

exports.getAll = (callback) => {
  const sql = `
        SELECT
            id,
            name,
            acronym,
            details,
            is_active,
            created_at

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
            acronym,
            details,
            is_active,
            created_at

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
            acronym,
            details
        )

        VALUES (?,?,?)
    `;

  db.run(sql, [data.name, data.acronym, data.details], callback);
};

// ============================
// Update Center
// ============================

exports.update = (id, data, callback) => {
  const sql = `
        UPDATE centers

        SET
            name = ?,
            acronym = ?,
            details = ?,
            is_active = ?

        WHERE id = ?
    `;

  db.run(
    sql,
    [data.name, data.acronym, data.details, data.is_active, id],
    callback,
  );
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


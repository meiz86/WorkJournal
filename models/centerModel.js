const db = require("../database/db");

// ============================
// Get all centers
// ============================

function getAll(callback) {
  const sql = `
    SELECT
      c.*,

      (
        SELECT COUNT(*)
        FROM stations s
        WHERE s.center_id = c.id
      ) AS station_count

    FROM centers c

    WHERE c.is_active = 1

    ORDER BY c.name
  `;

  db.all(sql, [], callback);
}

// ============================
// Get center by ID
// ============================

function getById(id, callback) {
  db.get(
    `
    SELECT *
    FROM centers
    WHERE id = ?
    `,
    [id],
    callback
  );
}

// ============================
// Create center
// ============================

function create(center, callback) {
  db.run(
    `
    INSERT INTO centers
    (
      name,
      acronym,
      details
    )
    VALUES (?, ?, ?)
    `,
    [
      center.name,
      center.acronym,
      center.details,
    ],
    callback
  );
}

// ============================
// Update center
// ============================

function update(id, center, callback) {
  db.run(
    `
    UPDATE centers
    SET
      name = ?,
      acronym = ?,
      details = ?
    WHERE id = ?
    `,
    [
      center.name,
      center.acronym,
      center.details,
      id,
    ],
    callback
  );
}

// ============================
// Soft Delete
// ============================

function remove(id, callback) {
  db.run(
    `
    UPDATE centers
    SET is_active = 0
    WHERE id = ?
    `,
    [id],
    callback
  );
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
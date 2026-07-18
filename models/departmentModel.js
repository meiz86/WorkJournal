const db = require("../database/db");

// ============================
// Get all active departments
// ============================

function getAll(callback) {
  const sql = `
    SELECT *
    FROM departments
    WHERE is_active = 1
    ORDER BY name
  `;

  db.all(sql, [], callback);
}

// ============================
// Get department by ID
// ============================

function getById(id, callback) {
  db.get(
    `
    SELECT *
    FROM departments
    WHERE id = ?
    `,
    [id],
    callback
  );
}

// ============================
// Create department
// ============================

function create(department, callback) {
  const sql = `
    INSERT INTO departments
    (
      name,
      manager
    )
    VALUES (?, ?)
  `;

  db.run(
    sql,
    [
      department.name,
      department.manager,
    ],
    callback
  );
}

// ============================
// Update department
// ============================

function update(id, department, callback) {
  const sql = `
    UPDATE departments
    SET
      name = ?,
      manager = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      department.name,
      department.manager,
      id,
    ],
    callback
  );
}

// ============================
// Soft delete
// ============================

function remove(id, callback) {
  db.run(
    `
    UPDATE departments
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
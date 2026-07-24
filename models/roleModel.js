const db = require("../database/db");

// ============================
// Get all roles
// ============================

function getAll(callback) {
  const sql = `
    SELECT *
    FROM roles
    ORDER BY id
  `;

  db.all(sql, callback);
}

// ============================
// Get role by id
// ============================

function getById(id, callback) {
  db.get(
    `
    SELECT *
    FROM roles
    WHERE id = ?
  `,
    [id],
    callback,
  );
}

// ============================
// Create role
// ============================

function create(role, callback) {
  db.run(
    `
    INSERT INTO roles(name, description)
    VALUES (?, ?)
  `,
    [role.name, role.description],
    callback,
  );
}

// ============================
// Update role
// ============================

function update(id, role, callback) {
  db.run(
    `
    UPDATE roles
    SET
      name = ?,
      description = ?
    WHERE id = ?
  `,
    [role.name, role.description, id],
    callback,
  );
}

// ============================
// Delete role
// ============================

function remove(id, callback) {
  db.run(
    `
    DELETE FROM roles
    WHERE id = ?
  `,
    [id],
    callback,
  );
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};

const db = require("../database/db");

// ============================
// Create User
// ============================

function createUser(user, callback) {
  const sql = `
    INSERT INTO users
    (
      name,
      email,
      password,
      role,
      role_id
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [user.name, user.email, user.password, user.role, user.role_id],
    function (err) {
      callback(err, this.lastID);
    },
  );
}
// ============================
// Find User by Email
// ============================

function findByEmail(email, callback) {
  const sql = `
    SELECT
      users.*,
      roles.name AS role_name

    FROM users

    LEFT JOIN roles
      ON users.role_id = roles.id

    WHERE users.email = ?
  `;

  db.get(sql, [email], callback);
}

// ============================
// Find User by ID
// ============================

function findById(id, callback) {
  const sql = `
    SELECT
      users.*,
      roles.name AS role_name

    FROM users

    LEFT JOIN roles
      ON users.role_id = roles.id

    WHERE users.id = ?
  `;

  db.get(sql, [id], callback);
}
// ============================
// Get All Users
// ============================

function getAllUsers(callback) {
  const sql = `
    SELECT
      users.*,
      roles.name AS role_name

    FROM users

    LEFT JOIN roles
      ON users.role_id = roles.id

    ORDER BY users.name
  `;

  db.all(sql, callback);
}

// ============================
// Update User Role
// ============================

function updateRole(userId, roleId, callback) {
  const sql = `
    UPDATE users
    SET role_id = ?
    WHERE id = ?
  `;

  db.run(sql, [roleId, userId], callback);
}
// ============================
// Find User For Edit
// ============================

function getUserById(id, callback) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = ?
  `;

  db.get(sql, [id], callback);
}

// ============================
// Update User
// ============================

function updateUser(id, user, callback) {
  let sql;
  let params;

  if (user.password) {
    sql = `
      UPDATE users
      SET
        name = ?,
        email = ?,
        password = ?,
        role = ?,
        role_id = ?
      WHERE id = ?
    `;

    params = [
      user.name,
      user.email,
      user.password,
      user.role,
      user.role_id,
      id,
    ];
  } else {
    sql = `
      UPDATE users
      SET
        name = ?,
        email = ?,
        role = ?,
        role_id = ?
      WHERE id = ?
    `;

    params = [user.name, user.email, user.role, user.role_id, id];
  }

  db.run(sql, params, callback);
}

// ============================
// Delete User
// ============================

function deleteUser(id, callback) {
  const sql = `
    DELETE FROM users
    WHERE id = ?
  `;

  db.run(sql, [id], callback);
}
// ============================
// Update User Status
// ============================

function updateStatus(id, status, callback) {
  const sql = `
    UPDATE users
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, id], callback);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllUsers,
  updateRole,
  getUserById,
  updateUser,
  deleteUser,
  updateStatus,
};

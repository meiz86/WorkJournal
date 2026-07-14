const db = require("../database/db");

function createUser(user, callback) {
  const sql = `
        INSERT INTO users
        (
            name,
            email,
            password,
            role
        )
        VALUES (?, ?, ?, ?)
    `;

  db.run(
    sql,
    [user.name, user.email, user.password, user.role || "Employee"],
    function (err) {
      callback(err, this.lastID);
    },
  );
}

function findByEmail(email, callback) {
  const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

  db.get(sql, [email], callback);
}

function findById(id, callback) {
  const sql = `
        SELECT *
        FROM users
        WHERE id = ?
    `;

  db.get(sql, [id], callback);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};

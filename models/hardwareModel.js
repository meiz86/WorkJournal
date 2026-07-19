const db = require("../database/db");

// ===================================
// Get hardware by center
// ===================================

function getByCenter(centerId, callback) {
  const sql = `
        SELECT *
        FROM hardware
        WHERE center_id=?
        ORDER BY type,brand,model
    `;

  db.all(sql, [centerId], callback);
}

// ===================================
// Get one hardware
// ===================================

function getById(id, callback) {
  db.get(
    "SELECT * FROM hardware WHERE id=?",

    [id],

    callback,
  );
}

// ===================================
// Create
// ===================================

function create(data, callback) {
  const sql = `

        INSERT INTO hardware
        (
            center_id,
            type,
            brand,
            model,
            quantity,
            serial_number,
            ip_address,
            status,
            notes
        )

        VALUES(?,?,?,?,?,?,?,?,?)

    `;

  db.run(
    sql,
    [
      data.center_id,

      data.type,

      data.brand,

      data.model,

      data.quantity,

      data.serial_number,

      data.ip_address,

      data.status,

      data.notes,
    ],
    callback,
  );
}

// ===================================
// Update
// ===================================

function update(id, data, callback) {
  const sql = `

        UPDATE hardware

        SET

            type=?,

            brand=?,

            model=?,

            quantity=?,

            serial_number=?,

            ip_address=?,

            status=?,

            notes=?

        WHERE id=?

    `;

  db.run(
    sql,
    [
      data.type,

      data.brand,

      data.model,

      data.quantity,

      data.serial_number,

      data.ip_address,

      data.status,

      data.notes,

      id,
    ],
    callback,
  );
}

// ===================================
// Delete
// ===================================

function remove(id, callback) {
  db.run(
    "DELETE FROM hardware WHERE id=?",

    [id],

    callback,
  );
}

module.exports = {
  getByCenter,

  getById,

  create,

  update,

  remove,
};

const db = require("../database/db");

// ============================
// Get all stations
// ============================

function getAll(callback) {
  const sql = `
    SELECT
      s.*,
      c.name AS center
    FROM stations s
    LEFT JOIN centers c
      ON c.id = s.center_id
    ORDER BY c.name, s.name
  `;

  db.all(sql, [], callback);
}

// ============================
// Get stations by center
// ============================

function getByCenter(centerId, callback) {
  const sql = `
    SELECT *
    FROM stations
    WHERE center_id = ?
    ORDER BY name
  `;

  db.all(sql, [centerId], callback);
}

// ============================
// Get station by id
// ============================

function getById(id, callback) {
  db.get(
    `
    SELECT *
    FROM stations
    WHERE id = ?
    `,
    [id],
    callback,
  );
}

// ============================
// Create station
// ============================

function create(station, callback) {
  const sql = `
    INSERT INTO stations
    (
      center_id,
      name,
      protocol,
      notes
    )
    VALUES (?, ?, ?, ?)
  `;

  db.run(
    sql,
    [station.center_id, station.name, station.protocol, station.notes],
    callback,
  );
}

// ============================
// Update station
// ============================

function update(id, station, callback) {
  const sql = `
    UPDATE stations
    SET
      center_id = ?,
      name = ?,
      protocol = ?,
      notes = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [station.center_id, station.name, station.protocol, station.notes, id],
    callback,
  );
}

// ============================
// Delete station
// ============================

function remove(id, callback) {
  db.run(
    `
    DELETE FROM stations
    WHERE id = ?
    `,
    [id],
    callback,
  );
}

module.exports = {
  getAll,
  getByCenter,
  getById,
  create,
  update,
  remove,
};

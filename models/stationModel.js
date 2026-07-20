const db = require("../database/db");

// ============================
// Get All Stations
// ============================

exports.getAll = (callback) => {
  const sql = `
        SELECT
            s.id,
            s.center_id,
            s.name,
            s.protocol,
            s.media,
            s.notes,
            c.name AS center_name

        FROM stations s

        LEFT JOIN centers c
            ON c.id = s.center_id

        ORDER BY c.name, s.name
    `;

  db.all(sql, callback);
};

// ============================
// Get Station By ID
// ============================

exports.getById = (id, callback) => {
  const sql = `
        SELECT
            s.*,
            c.name AS center_name

        FROM stations s

        LEFT JOIN centers c
            ON c.id = s.center_id

        WHERE s.id = ?
    `;

  db.get(sql, [id], callback);
};

// ============================
// Create Station
// ============================

exports.create = (data, callback) => {
  const sql = `
        INSERT INTO stations
        (
            center_id,
            name,
            protocol,
            media,
            notes
        )

        VALUES (?,?,?,?,?)
    `;

  db.run(
    sql,
    [data.center_id, data.name, data.protocol, data.media, data.notes],
    callback,
  );
};

// ============================
// Update Station
// ============================

exports.update = (id, data, callback) => {
  const sql = `
        UPDATE stations

        SET
            center_id = ?,
            name = ?,
            protocol = ?,
            media = ?,
            notes = ?

        WHERE id = ?
    `;

  db.run(
    sql,
    [data.center_id, data.name, data.protocol, data.media, data.notes, id],
    callback,
  );
};

// ============================
// Delete Station
// ============================

exports.remove = (id, callback) => {
  db.run(
    `
        DELETE FROM stations
        WHERE id = ?
    `,
    [id],
    callback,
  );
};

// ============================
// Search Stations
// ============================

exports.search = (search, callback) => {
  const keyword = `%${search}%`;

  const sql = `
        SELECT
            s.id,
            s.center_id,
            s.name,
            s.protocol,
            s.media,
            s.notes,
            c.name AS center_name

        FROM stations s

        LEFT JOIN centers c
            ON c.id = s.center_id

        WHERE
            s.name LIKE ?
            OR s.protocol LIKE ?
            OR s.media LIKE ?
            OR s.notes LIKE ?
            OR c.name LIKE ?

        ORDER BY c.name, s.name
    `;

  db.all(sql, [keyword, keyword, keyword, keyword, keyword], callback);
};

// ============================
// Station Report
// ============================

exports.getReport = (filters, callback) => {
  let sql = `
        SELECT
            s.id,
            s.name,
            s.protocol,
            s.media,
            s.notes,
            c.id AS center_id,
            c.name AS center_name

        FROM stations s

        LEFT JOIN centers c
            ON c.id = s.center_id

        WHERE 1=1
    `;

  const params = [];

  if (filters.center_id) {
    sql += ` AND s.center_id = ?`;
    params.push(filters.center_id);
  }

  if (filters.protocol) {
    sql += ` AND s.protocol = ?`;
    params.push(filters.protocol);
  }

  if (filters.media) {
    sql += ` AND s.media = ?`;
    params.push(filters.media);
  }

  if (filters.search) {
    sql += `
        AND (
            s.name LIKE ?
            OR c.name LIKE ?
            OR s.notes LIKE ?
        )
    `;

    const keyword = `%${filters.search}%`;

    params.push(keyword, keyword, keyword);
  }

  sql += `
        ORDER BY
            c.name,
            s.name
    `;

  db.all(sql, params, callback);
};

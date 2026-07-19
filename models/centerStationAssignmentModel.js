const db = require("../database/db");

// ============================
// Assign Station To Center
// ============================

exports.assign = (centerId, stationId, protocol, callback) => {
  const sql = `
        INSERT INTO center_station_assignments
        (
            center_id,
            station_id,
            protocol
        )

        VALUES (?,?,?)
    `;

  db.run(sql, [centerId, stationId, protocol], callback);
};

// ============================
// Remove Assignment
// ============================

exports.remove = (centerId, stationId, callback) => {
  const sql = `
        DELETE FROM center_station_assignments

        WHERE center_id = ?

        AND station_id = ?
    `;

  db.run(sql, [centerId, stationId], callback);
};

// ============================
// Stations Of Center
// ============================

exports.getStationsForCenter = (centerId, callback) => {
  const sql = `
        SELECT

            s.id,
            s.name,
            s.notes,

            csa.protocol

        FROM center_station_assignments csa

        INNER JOIN stations s
            ON s.id = csa.station_id

        WHERE csa.center_id = ?

        ORDER BY s.name
    `;

  db.all(sql, [centerId], callback);
};

// ============================
// Centers Of Station
// ============================

exports.getCentersForStation = (stationId, callback) => {
  const sql = `
        SELECT

            c.id,
            c.name,
            c.acronym,

            csa.protocol

        FROM center_station_assignments csa

        INNER JOIN centers c
            ON c.id = csa.center_id

        WHERE csa.station_id = ?

        ORDER BY c.name
    `;

  db.all(sql, [stationId], callback);
};

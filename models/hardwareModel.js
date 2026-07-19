const db = require("../database/db");


// ============================
// Hardware by Center
// ============================

exports.getByCenter = (centerId, callback) => {

    const sql = `
        SELECT
            id,
            center_id,
            type,
            brand,
            model,
            quantity,
            serial_number,
            ip_address,
            status,
            notes,
            created_at

        FROM hardware

        WHERE center_id = ?

        ORDER BY type, brand
    `;

    db.all(sql, [centerId], callback);

};


// ============================
// Get One Hardware
// ============================

exports.getById = (id, callback) => {

    const sql = `
        SELECT *
        FROM hardware
        WHERE id = ?
    `;

    db.get(sql, [id], callback);

};


// ============================
// Create
// ============================

exports.create = (data, callback) => {

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

        VALUES (?,?,?,?,?,?,?,?,?)
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
            data.notes
        ],
        callback
    );

};


// ============================
// Update
// ============================

exports.update = (id, data, callback) => {

    const sql = `
        UPDATE hardware

        SET

            type = ?,
            brand = ?,
            model = ?,
            quantity = ?,
            serial_number = ?,
            ip_address = ?,
            status = ?,
            notes = ?

        WHERE id = ?
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
            id
        ],
        callback
    );

};


// ============================
// Delete
// ============================

exports.remove = (id, callback) => {

    db.run(
        `
        DELETE FROM hardware
        WHERE id = ?
        `,
        [id],
        callback
    );

};
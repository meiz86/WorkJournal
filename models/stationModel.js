const db = require("../database/db");


// ============================
// Get All Stations
// ============================

exports.getAll = (callback)=>{

    const sql = `
        SELECT
            id,
            name,
            protocol,
            notes

        FROM stations

        ORDER BY name
    `;

    db.all(sql, callback);

};



// ============================
// Get Station By ID
// ============================

exports.getById = (id, callback)=>{

    const sql = `
        SELECT
            id,
            name,
            protocol,
            notes

        FROM stations

        WHERE id = ?
    `;

    db.get(sql,[id],callback);

};



// ============================
// Create Station
// ============================

exports.create = (data,callback)=>{

    const sql = `

        INSERT INTO stations
        (
            name,
            protocol,
            notes
        )

        VALUES (?,?,?)

    `;


    db.run(
        sql,
        [
            data.name,
            data.protocol,
            data.notes
        ],
        callback
    );

};



// ============================
// Update Station
// ============================

exports.update = (id,data,callback)=>{


    const sql = `

        UPDATE stations

        SET

            name=?,
            protocol=?,
            notes=?

        WHERE id=?

    `;


    db.run(
        sql,
        [
            data.name,
            data.protocol,
            data.notes,
            id
        ],
        callback
    );

};



// ============================
// Delete Station
// ============================

exports.remove = (id,callback)=>{

    const sql = `

        DELETE FROM stations

        WHERE id=?

    `;


    db.run(sql,[id],callback);

};
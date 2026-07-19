const db = require("../database/db");

// Get all categories

exports.getCategories = (callback) => {
  const sql = `
        SELECT DISTINCT category
        FROM lookup_values
        ORDER BY category
    `;

  db.all(sql, callback);
};

// Get values by category

exports.getByCategory = (category, callback) => {
  const sql = `
        SELECT *
        FROM lookup_values

        WHERE category = ?

        ORDER BY sort_order,value
    `;

  db.all(sql, [category], callback);
};

// Get one

exports.getById = (id, callback) => {
  const sql = `
        SELECT *
        FROM lookup_values
        WHERE id=?
    `;

  db.get(sql, [id], callback);
};

// Create

exports.create = (data, callback) => {
  const sql = `

    INSERT INTO lookup_values

    (
        category,
        value,
        description,
        color
    )

    VALUES (?,?,?,?)

    `;

  db.run(
    sql,
    [data.category, data.value, data.description, data.color],
    callback,
  );
};

// Update

exports.update = (id, data, callback) => {
  const sql = `

    UPDATE lookup_values

    SET

    value=?,
    description=?,
    color=?

    WHERE id=?

    `;

  db.run(sql, [data.value, data.description, data.color, id], callback);
};

// Delete

exports.remove = (id, callback) => {
  const sql = `

    DELETE FROM lookup_values

    WHERE id=?

    `;

  db.run(sql, [id], callback);
};

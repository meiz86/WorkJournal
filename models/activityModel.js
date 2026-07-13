const db = require("../database/db");

function createActivity(activity, callback) {
  const sql = `
        INSERT INTO activities
        (
            date,
            start_time,
            end_time,
            project,
            department,
            activity,
            description,
            duration,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?,  ?, ?, ?)
    `;

  db.run(
    sql,
    [
      activity.date,
      activity.start_time,
      activity.end_time,
      activity.project,
      activity.department,
      activity.activity,
      activity.description,
      activity.duration,
      activity.status,
    ],
    function (err) {
      callback(err, this.lastID);
    },
  );
}

function getActivities(filters, callback) {
  let sql = `
        SELECT *
        FROM activities
        WHERE 1 = 1
    `;

  let params = [];

  // Search
  if (filters.search) {
    sql += `
            AND (
                project LIKE ?
                OR department LIKE ?
                OR activity LIKE ?
                OR description LIKE ?
            )
        `;

    const keyword = `%${filters.search}%`;

    params.push(keyword, keyword, keyword, keyword);
  }

  // Status Filter
  if (filters.status && filters.status !== "All") {
    sql += `
            AND status = ?
        `;

    params.push(filters.status);
  }

  sql += `
        ORDER BY date DESC, id DESC
    `;
  // console.log(sql);
  // console.log(params);
  db.all(sql, params, (err, rows) => {
    callback(err, rows);
  });
}
module.exports = {
  createActivity,
  getActivities,
};

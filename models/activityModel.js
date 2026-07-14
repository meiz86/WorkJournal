const db = require("../database/db");

function createActivity(activity, callback) {
  const sql = `
          INSERT INTO activities
          (
              user_id,
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
          VALUES (?, ?, ?, ?, ?,?, ?,  ?, ?, ?)
      `;

  db.run(
    sql,
    [
      activity.user_id,
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

function getActivities(filters, userId, callback) {
  let sql = `
    SELECT *
    FROM activities
    WHERE user_id = ?
  `;

  const params = [userId];

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

  if (filters.status && filters.status !== "All") {
    sql += " AND status = ?";
    params.push(filters.status);
  }

  sql += `
    ORDER BY date DESC, start_time DESC
  `;

  db.all(sql, params, callback);
}
module.exports = {
  createActivity,
  getActivities,
};

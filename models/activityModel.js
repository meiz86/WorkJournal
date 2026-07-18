const db = require("../database/db");

// ============================
// Create Activity
// ============================

function createActivity(activity, callback) {
  const sql = `
    INSERT INTO activities
    (
      user_id,
      project_id,
      date,
      start_time,
      end_time,
      department_id,
      activity,
      description,
      duration,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      activity.user_id,
      activity.project_id,
      activity.date,
      activity.start_time,
      activity.end_time,
      activity.department_id,
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

// ============================
// Get Activities
// ============================

function getActivities(filters, userId, callback) {
  let sql = `
SELECT
    a.*,
    p.name AS project,
    d.name AS department

FROM activities a

LEFT JOIN projects p
    ON a.project_id = p.id

LEFT JOIN departments d
    ON a.department_id = d.id

WHERE a.user_id = ?
  `;

  const params = [userId];

  if (filters.search) {
    sql += `
      AND (
        p.name LIKE ?
        OR d.name LIKE ?
        OR a.activity LIKE ?
        OR a.description LIKE ?
      )
    `;

    const keyword = `%${filters.search}%`;
    params.push(keyword, keyword, keyword, keyword);
  }

  if (filters.status && filters.status !== "All") {
    sql += " AND a.status = ?";
    params.push(filters.status);
  }

  sql += `
    ORDER BY a.date DESC, a.start_time DESC
  `;

  db.all(sql, params, callback);
}

module.exports = {
  createActivity,
  getActivities,
};

const db = require("../database/db");

function getDailyReport(filters, callback) {
  let sql = `
        SELECT
            a.date,
            p.name AS project,
            a.department,
            a.activity,
            a.description,       
            a.duration,
            a.status
        FROM activities a
        LEFT JOIN projects p
            ON a.project_id = p.id
        WHERE 1=1
    `;

  const params = [];

  if (filters.date) {
    sql += " AND a.date = ?";
    params.push(filters.date);
  }

  if (filters.project_id) {
    sql += " AND a.project_id = ?";
    params.push(filters.project_id);
  }

  if (filters.department) {
    sql += " AND a.department = ?";
    params.push(filters.department);
  }

  if (filters.status) {
    sql += " AND a.status = ?";
    params.push(filters.status);
  }

  if (filters.search) {
    sql += " AND a.activity LIKE ?";
    params.push("%" + filters.search + "%");
  }

  sql += " ORDER BY a.start_time";

  db.all(sql, params, (err, activities) => {
    if (err) return callback(err);

    callback(null, activities);
  });
}
function getProjects(callback) {
  const sql = `
        SELECT
            id,
            name
        FROM projects
        WHERE is_active = 1
        ORDER BY name
    `;

  db.all(sql, [], callback);
}

function getDepartments(callback) {
  const sql = `
        SELECT DISTINCT
            department
        FROM activities
        WHERE department IS NOT NULL
          AND department <> ''
        ORDER BY department
    `;

  db.all(sql, [], callback);
}
function getWeeklyReport(week, callback) {
  const sql = `
        SELECT
            date,
            COUNT(*) AS activities,
            SUM(duration) AS minutes,
            SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN status!='Completed' THEN 1 ELSE 0 END) AS pending
        FROM activities
        WHERE strftime('%Y-%W', date) = strftime('%Y-%W','now')
        GROUP BY date
        ORDER BY date
    `;

  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);

    callback(null, rows);
  });
}
function getMonthlyReport(month, callback) {
  let sql = `
        SELECT
            date,
            COUNT(*) AS activities,
            SUM(duration) AS minutes,
            SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN status!='Completed' THEN 1 ELSE 0 END) AS pending
        FROM activities
    `;

  const params = [];

  if (month) {
    sql += ` WHERE strftime('%Y-%m', date) = ?`;

    params.push(month);
  } else {
    sql += ` WHERE strftime('%Y-%m', date) = strftime('%Y-%m','now')`;
  }

  sql += `
        GROUP BY date
        ORDER BY date
    `;

  db.all(sql, params, (err, rows) => {
    if (err) return callback(err);

    callback(null, rows);
  });
}
function getProjectReport(projectId, callback) {
  let sql = `
        SELECT
            p.name AS project,
            COUNT(a.id) AS activities,
            SUM(a.duration) AS minutes,
            SUM(CASE WHEN a.status='Completed' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN a.status!='Completed' THEN 1 ELSE 0 END) AS pending
        FROM projects p
        LEFT JOIN activities a
            ON p.id = a.project_id
    `;

  const params = [];

  if (projectId) {
    sql += ` WHERE p.id = ?`;

    params.push(projectId);
  }

  sql += `
        GROUP BY p.id
        ORDER BY p.name
    `;

  db.all(sql, params, callback);
}
module.exports = {
  getDailyReport,
  getProjects,
  getDepartments,
  getWeeklyReport,
  getMonthlyReport,
  getProjectReport,
};

const db = require("../database/db");

// ============================
// Daily Report
// ============================

function getDailyReport(userId, filters, callback) {
  let sql = `
    SELECT
      a.date,
      p.name AS project,
      d.name AS department,
      a.activity,
      a.description,
      a.duration,
      a.status
    FROM activities a

    LEFT JOIN projects p
      ON a.project_id = p.id

    LEFT JOIN departments d
      ON a.department_id = d.id

    WHERE a.user_id = ?
  `;

  const params = [userId];

  if (filters.date) {
    sql += " AND a.date = ?";
    params.push(filters.date);
  }

  if (filters.project_id) {
    sql += " AND a.project_id = ?";
    params.push(filters.project_id);
  }

  if (filters.department_id) {
    sql += " AND a.department_id = ?";
    params.push(filters.department_id);
  }

  if (filters.status) {
    sql += " AND a.status = ?";
    params.push(filters.status);
  }

  if (filters.search) {
    sql += `
      AND (
        a.activity LIKE ?
        OR a.description LIKE ?
      )
    `;

    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  sql += `
    ORDER BY a.date DESC,
             a.start_time DESC
  `;

  db.all(sql, params, callback);
}

// ============================
// Projects
// ============================

function getProjects(callback) {
  db.all(
    `
    SELECT
      id,
      name
    FROM projects
    WHERE is_active = 1
    ORDER BY name
    `,
    [],
    callback,
  );
}

// ============================
// Departments
// ============================

function getDepartments(callback) {
  db.all(
    `
    SELECT
      id,
      name
    FROM departments
    WHERE is_active = 1
    ORDER BY name
    `,
    [],
    callback,
  );
}

// ============================
// Weekly Report
// ============================

function getWeeklyReport(userId, week, callback) {
  let sql = `
    SELECT
      date,
      COUNT(*) AS activities,
      SUM(duration) AS minutes,
      SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status!='Completed' THEN 1 ELSE 0 END) AS pending
    FROM activities
    WHERE user_id = ?
  `;

  const params = [userId];

  if (week) {
    const [year, weekNo] = week.split("-W");

    sql += `
      AND strftime('%Y', date) = ?
      AND strftime('%W', date) = ?
    `;

    params.push(year, weekNo);
  }

  sql += `
    GROUP BY date
    ORDER BY date
  `;

  db.all(sql, params, callback);
}

// ============================
// Monthly Report
// ============================

function getMonthlyReport(userId, month, callback) {
  let sql = `
    SELECT
      date,
      COUNT(*) AS activities,
      SUM(duration) AS minutes,
      SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status!='Completed' THEN 1 ELSE 0 END) AS pending
    FROM activities
    WHERE user_id = ?
  `;

  const params = [userId];

  if (month) {
    sql += " AND strftime('%Y-%m', date) = ?";
    params.push(month);
  } else {
    sql += " AND strftime('%Y-%m', date) = strftime('%Y-%m','now')";
  }

  sql += `
    GROUP BY date
    ORDER BY date
  `;

  db.all(sql, params, callback);
}

// ============================
// Project Report
// ============================

function getProjectReport(userId, projectId, callback) {
  let sql = `
    SELECT
      p.name AS project,
      COUNT(a.id) AS activities,
      IFNULL(SUM(a.duration), 0) AS minutes,
      SUM(CASE WHEN a.status='Completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN a.status!='Completed' THEN 1 ELSE 0 END) AS pending
    FROM projects p

    LEFT JOIN activities a
      ON p.id = a.project_id
     AND a.user_id = ?
  `;

  const params = [userId];

  if (projectId) {
    sql += " WHERE p.id = ?";
    params.push(projectId);
  }

  sql += `
    GROUP BY p.id
    ORDER BY p.name
  `;

  db.all(sql, params, callback);
}
// ============================
// Station Report
// ============================


// ============================
// Centers List
// ============================

function getCenters(callback) {
  db.all(
    `
    SELECT
      id,
      name
    FROM centers
    ORDER BY name
    `,
    [],
    callback
  );
}

// ============================
// Station Report
// ============================

// ============================
// Station Report
// ============================

function getStationReport(filters, callback) {
  let sql = `
    SELECT
      s.id,
      s.name,
      s.protocol,
      s.media,
      s.notes,
      c.name AS center_name
    FROM stations s
    LEFT JOIN centers c
      ON c.id = s.center_id
    WHERE 1=1
  `;

  const params = [];

  if (filters.center_id) {
    sql += " AND s.center_id = ?";
    params.push(filters.center_id);
  }

  if (filters.protocol) {
    sql += " AND s.protocol = ?";
    params.push(filters.protocol);
  }

  if (filters.media) {
    sql += " AND s.media = ?";
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
}
module.exports = {
  getDailyReport,
  getProjects,
  getDepartments,
  getWeeklyReport,
  getMonthlyReport,
  getProjectReport,

  getCenters,
  getStationReport,
};
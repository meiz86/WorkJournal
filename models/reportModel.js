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
    const [year, weekNumber] = week.split("-W").map(Number);

    const firstDay = new Date(year, 0, 1);

    const dayOffset = (weekNumber - 1) * 7 - firstDay.getDay() + 1;

    const monday = new Date(firstDay);
    monday.setDate(firstDay.getDate() + dayOffset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (d) => d.toISOString().slice(0, 10);

    sql += `
AND date BETWEEN ? AND ?
`;

    params.push(format(monday), format(sunday));
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
    callback,
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
function drawWeeklyTable(doc, rows) {
  let y = doc.y;

  doc.font("Helvetica-Bold").fontSize(10);

  doc.text("Date", 40, y);
  doc.text("Activities", 150, y);
  doc.text("Hours", 250, y);
  doc.text("Completed", 340, y);
  doc.text("Pending", 450, y);

  y += 18;

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 10;

  doc.font("Helvetica");

  rows.forEach((row) => {
    if (y > 730) {
      doc.addPage();
      y = 50;
    }

    doc.text(row.date, 40, y);
    doc.text(String(row.activities), 150, y);
    doc.text(((row.minutes || 0) / 60).toFixed(1), 250, y);
    doc.text(String(row.completed), 340, y);
    doc.text(String(row.pending), 450, y);

    y += 20;
  });
}
function drawMonthlyTable(doc, rows) {
  drawWeeklyTable(doc, rows);
}
function drawProjectTable(doc, rows) {
  let y = doc.y;

  doc.font("Helvetica-Bold");

  doc.text("Project", 40, y);
  doc.text("Activities", 220, y);
  doc.text("Hours", 320, y);
  doc.text("Completed", 410, y);
  doc.text("Pending", 500, y);

  y += 18;

  doc.moveTo(40, y).lineTo(550, y).stroke();

  y += 10;

  doc.font("Helvetica");

  rows.forEach((r) => {
    if (y > 730) {
      doc.addPage();
      y = 50;
    }

    doc.text(r.project || "-", 40, y, { width: 160 });
    doc.text(String(r.activities), 220, y);
    doc.text(((r.minutes || 0) / 60).toFixed(1), 320, y);
    doc.text(String(r.completed), 410, y);
    doc.text(String(r.pending), 500, y);

    y += 20;
  });
}
// ============================
// Center Report
// ============================

function getCenterReport(callback) {
  const sql = `
    SELECT
      c.name AS center,
      s.media,
      COUNT(*) AS stations

    FROM centers c

    LEFT JOIN stations s
      ON s.center_id = c.id

    GROUP BY c.id, s.media

    ORDER BY c.name, s.media
  `;

  db.all(sql, callback);
}
function getCenterMediaReport(callback) {
  const sql = `
    SELECT
      c.name AS center,
      COUNT(s.id) AS stations,

      SUM(CASE WHEN s.media='Fiber' THEN 1 ELSE 0 END) AS Fiber,

      SUM(CASE WHEN s.media='Microwave' THEN 1 ELSE 0 END) AS Microwave,

      SUM(CASE WHEN s.media='PLC' THEN 1 ELSE 0 END) AS PLC,

      SUM(CASE WHEN s.media='Radio' THEN 1 ELSE 0 END) AS Radio,

      SUM(CASE WHEN s.media='Wireless' THEN 1 ELSE 0 END) AS Wireless,

      SUM(CASE WHEN s.media='Satellite' THEN 1 ELSE 0 END) AS Satellite

    FROM centers c

    LEFT JOIN stations s
      ON c.id = s.center_id

    GROUP BY c.id

    ORDER BY c.name
  `;

  db.all(sql, callback);
}
module.exports = {
  getCenterMediaReport,
  getDailyReport,
  getProjects,
  getDepartments,
  getWeeklyReport,
  getMonthlyReport,
  getProjectReport,
  getCenterReport,
  getCenters,
  getStationReport,
};

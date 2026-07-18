const db = require("../database/db");

// ============================
// Monthly Calendar Data
// ============================

function getCalendarData(userId, month, callback) {
  const sql = `
    SELECT
      d.date,
      COALESCE(a.activities, 0) AS activities,
      COALESCE(t.tasks, 0) AS tasks
    FROM
    (
      SELECT DISTINCT date
      FROM activities
      WHERE user_id = ?
        AND substr(date,1,7) = ?

      UNION

      SELECT DISTINCT due_date AS date
      FROM tasks
      WHERE user_id = ?
        AND substr(due_date,1,7) = ?
    ) d

    LEFT JOIN
    (
      SELECT
        date,
        COUNT(*) AS activities
      FROM activities
      WHERE user_id = ?
        AND substr(date,1,7) = ?
      GROUP BY date
    ) a
      ON d.date = a.date

    LEFT JOIN
    (
      SELECT
        due_date,
        COUNT(*) AS tasks
      FROM tasks
      WHERE user_id = ?
        AND substr(due_date,1,7) = ?
      GROUP BY due_date
    ) t
      ON d.date = t.due_date

    ORDER BY d.date
  `;

  db.all(
    sql,
    [userId, month, userId, month, userId, month, userId, month],
    callback,
  );
}

// ============================
// Daily Agenda
// ============================

function getDayData(userId, date, callback) {
  const activitiesSql = `
    SELECT
      a.*,
      p.name AS project,
      d.name AS department
    FROM activities a

    LEFT JOIN projects p
      ON p.id = a.project_id

    LEFT JOIN departments d
      ON d.id = a.department_id

    WHERE a.user_id = ?
      AND a.date = ?

    ORDER BY a.start_time
  `;

  const tasksSql = `
    SELECT
      t.*,
      p.name AS project,
      d.name AS department
    FROM tasks t

    LEFT JOIN projects p
      ON p.id = t.project_id

    LEFT JOIN departments d
      ON d.id = t.department_id

    WHERE t.user_id = ?
      AND t.due_date = ?

    ORDER BY t.priority DESC
  `;

  db.all(activitiesSql, [userId, date], (err, activities) => {
    if (err) return callback(err);

    db.all(tasksSql, [userId, date], (err, tasks) => {
      if (err) return callback(err);

      callback(null, {
        activities,
        tasks,
      });
    });
  });
}

module.exports = {
  getCalendarData,
  getDayData,
};

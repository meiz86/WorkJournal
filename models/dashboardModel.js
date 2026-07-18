const db = require("../database/db");

function getStatistics(userId, callback) {
  const sql = `
        SELECT
            COUNT(*) AS totalActivities,

            SUM(
                CASE
                    WHEN date = DATE('now')
                    THEN 1 ELSE 0
                END
            ) AS todayActivities,

            SUM(
                CASE
                    WHEN strftime('%Y-%W', date)=strftime('%Y-%W','now')
                    THEN 1 ELSE 0
                END
            ) AS weekActivities,

            SUM(
                CASE
                    WHEN strftime('%Y-%m', date)=strftime('%Y-%m','now')
                    THEN 1 ELSE 0
                END
            ) AS monthActivities,

            SUM(duration) AS totalMinutes

        FROM activities
        WHERE user_id = ?
    `;

  db.get(sql, [userId], callback);
}

function getRecentActivities(userId, limit, callback) {
  const sql = `
    SELECT
        a.id,
        a.date,
        p.name AS project,
        a.activity,
        a.duration,
        a.status
    FROM activities a
    LEFT JOIN projects p
        ON a.project_id = p.id
    WHERE a.user_id = ?
    ORDER BY a.date DESC, a.id DESC
    LIMIT ?
  `;

  db.all(sql, [userId, limit], callback);
}
function getUpcomingTasks(userId, limit, callback) {
  const sql = `
    SELECT
        t.title,
        p.name AS project,
        t.due_date,
        t.priority,
        t.status
    FROM tasks t
    LEFT JOIN projects p
        ON t.project_id = p.id
    WHERE t.user_id = ?
      AND t.status != 'Completed'
    ORDER BY t.due_date ASC
    LIMIT ?
  `;

  db.all(sql, [userId, limit], callback);
}

function getWeeklyHours(userId, callback) {
  const sql = `
        SELECT
            date,
            SUM(duration) AS total_minutes
        FROM activities
        WHERE user_id = ?
          AND date >= date('now','-6 days')
        GROUP BY date
        ORDER BY date
    `;

  db.all(sql, [userId], callback);
}

function getTaskStatus(userId, callback) {
  const sql = `
        SELECT
            status,
            COUNT(*) AS total
        FROM tasks
        WHERE user_id = ?
        GROUP BY status
        ORDER BY
        CASE status
            WHEN 'Pending' THEN 1
            WHEN 'In Progress' THEN 2
            WHEN 'Completed' THEN 3
            ELSE 4
        END
    `;

  db.all(sql, [userId], callback);
}

function getWorkStreak(userId, callback) {
  const sql = `
        SELECT DISTINCT date
        FROM activities
        WHERE user_id = ?
        ORDER BY date DESC
    `;

  db.all(sql, [userId], (err, rows) => {
    if (err) return callback(err);

    let streak = 0;
    let current = new Date();

    for (const row of rows) {
      const expected = current.toISOString().slice(0, 10);

      if (row.date === expected) {
        streak++;

        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    callback(null, streak);
  });
}

function getTopProject(userId, callback) {
  const sql = `
    SELECT
        p.name AS project,
        SUM(a.duration) AS minutes
    FROM activities a
    LEFT JOIN projects p
        ON a.project_id = p.id
    WHERE a.user_id = ?
    GROUP BY a.project_id
    ORDER BY minutes DESC
    LIMIT 1
  `;

  db.get(sql, [userId], callback);
}

function getAverageHours(userId, callback) {
  const sql = `
        SELECT
            ROUND(AVG(total_minutes)/60.0,2) AS avg_hours
        FROM(
            SELECT
                date,
                SUM(duration) AS total_minutes
            FROM activities
            WHERE user_id = ?
            GROUP BY date
        )
    `;

  db.get(sql, [userId], callback);
}

function getCompletionRate(userId, callback) {
  const sql = `
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN 0
        ELSE ROUND(
            SUM(
                CASE
                    WHEN status = 'Completed'
                    THEN 1
                    ELSE 0
                END
            ) * 100.0 / COUNT(*),
            1
        )
    END AS rate
FROM tasks
WHERE user_id = ?
    `;

  db.get(sql, [userId], callback);
}
function getStatisticsAsync(userId) {
  return new Promise((resolve, reject) => {
    getStatistics(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getRecentActivitiesAsync(userId, limit) {
  return new Promise((resolve, reject) => {
    getRecentActivities(userId, limit, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getUpcomingTasksAsync(userId, limit) {
  return new Promise((resolve, reject) => {
    getUpcomingTasks(userId, limit, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getWeeklyHoursAsync(userId) {
  return new Promise((resolve, reject) => {
    getWeeklyHours(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getTaskStatusAsync(userId) {
  return new Promise((resolve, reject) => {
    getTaskStatus(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getWorkStreakAsync(userId) {
  return new Promise((resolve, reject) => {
    getWorkStreak(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getTopProjectAsync(userId) {
  return new Promise((resolve, reject) => {
    getTopProject(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getAverageHoursAsync(userId) {
  return new Promise((resolve, reject) => {
    getAverageHours(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getCompletionRateAsync(userId) {
  return new Promise((resolve, reject) => {
    getCompletionRate(userId, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

module.exports = {
  getStatistics,
  getRecentActivities,
  getUpcomingTasks,
  getWeeklyHours,
  getTaskStatus,
  getWorkStreak,
  getTopProject,
  getAverageHours,
  getCompletionRate,

  getStatisticsAsync,
  getRecentActivitiesAsync,
  getUpcomingTasksAsync,
  getWeeklyHoursAsync,
  getTaskStatusAsync,
  getWorkStreakAsync,
  getTopProjectAsync,
  getAverageHoursAsync,
  getCompletionRateAsync,
};

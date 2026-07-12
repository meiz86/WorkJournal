const db = require("../database/db");

function getStatistics(callback) {
  const sql = `

        SELECT

            COUNT(*) AS totalActivities,

            SUM(
                CASE
                    WHEN date = DATE('now')
                    THEN 1
                    ELSE 0
                END
            ) AS todayActivities,

            SUM(
                CASE
                    WHEN strftime('%Y-%W', date)
                    =
                    strftime('%Y-%W','now')
                    THEN 1
                    ELSE 0
                END
            ) AS weekActivities,

            SUM(
                CASE
                    WHEN strftime('%Y-%m', date)
                    =
                    strftime('%Y-%m','now')
                    THEN 1
                    ELSE 0
                END
            ) AS monthActivities,

            SUM(duration) AS totalMinutes

        FROM activities

    `;

  db.get(sql, [], (err, row) => {
    callback(err, row);
  });
}
function getRecentActivities(limit, callback) {
  const sql = `
        SELECT
            id,
            date,
            project,
            activity,
            duration,
            status
        FROM activities
        ORDER BY date DESC, id DESC
        LIMIT ?
    `;

  db.all(sql, [limit], (err, rows) => {
    callback(err, rows);
  });
}
function getUpcomingTasks(limit, callback) {
  const sql = `
        SELECT
            title,
            project,
            due_date,
            priority,
            status
        FROM tasks
        WHERE status != 'Completed'
        ORDER BY due_date ASC
        LIMIT ?
    `;

  db.all(sql, [limit], (err, rows) => {
    callback(err, rows);
  });
}
function getWeeklyHours(callback) {
  const sql = `
        SELECT
            date,
            SUM(duration) AS total_minutes
        FROM activities
        WHERE date >= date('now','-6 days')
        GROUP BY date
        ORDER BY date
    `;

  db.all(sql, [], callback);
}

function getTaskStatus(callback) {
  const sql = `
       SELECT
           status,
               COUNT(*) AS total
               FROM tasks
               GROUP BY status
               ORDER BY
               CASE status
                   WHEN 'Pending' THEN 1
                       WHEN 'In Progress' THEN 2
                           WHEN 'Completed' THEN 3
                               ELSE 4
                               END;
    `;

  db.all(sql, [], callback);
}
function getWorkStreak(callback) {
  const sql = `
        SELECT DISTINCT date
        FROM activities
        ORDER BY date DESC
    `;

  db.all(sql, [], (err, rows) => {
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
function getTopProject(callback) {
  const sql = `

        SELECT

            project,

            SUM(duration) AS minutes

        FROM activities

        GROUP BY project

        ORDER BY minutes DESC

        LIMIT 1

    `;

  db.get(sql, [], callback);
}
function getAverageHours(callback) {
  const sql = `

        SELECT

            ROUND(AVG(total_minutes)/60.0,2) AS avg_hours

        FROM(

            SELECT

                date,

                SUM(duration) AS total_minutes

            FROM activities

            GROUP BY date

        )

    `;

  db.get(sql, [], callback);
}
function getCompletionRate(callback) {
  const sql = `

        SELECT

            ROUND(

                SUM(

                    CASE

                        WHEN status='Completed'

                        THEN 1

                        ELSE 0

                    END

                )*100.0/

                COUNT(*)

            ,1)

            AS rate

        FROM tasks

    `;

  db.get(sql, [], callback);
}
function getStatisticsAsync() {
  return new Promise((resolve, reject) => {
    getStatistics((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getRecentActivitiesAsync(limit) {
  return new Promise((resolve, reject) => {
    getRecentActivities(limit, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getUpcomingTasksAsync(limit) {
  return new Promise((resolve, reject) => {
    getUpcomingTasks(limit, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getWeeklyHoursAsync() {
  return new Promise((resolve, reject) => {
    getWeeklyHours((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getTaskStatusAsync() {
  return new Promise((resolve, reject) => {
    getTaskStatus((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getWorkStreakAsync() {
  return new Promise((resolve, reject) => {
    getWorkStreak((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getTopProjectAsync() {
  return new Promise((resolve, reject) => {
    getTopProject((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getAverageHoursAsync() {
  return new Promise((resolve, reject) => {
    getAverageHours((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

function getCompletionRateAsync() {
  return new Promise((resolve, reject) => {
    getCompletionRate((err, data) => {
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

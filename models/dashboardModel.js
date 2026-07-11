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
    `;

    db.all(sql, [], callback);

}
module.exports = {
  getStatistics,
  getRecentActivities,
  getUpcomingTasks,
  getWeeklyHours,
  getTaskStatus,
};

const db = require("../database/db");

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
    [
      userId, month,
      userId, month,
      userId, month,
      userId, month
    ],
    callback
  );
}

function getDayData(userId, date, callback) {

  const activitiesSql = `
        SELECT *
        FROM activities
        WHERE user_id = ?
          AND date = ?
    `;

  const tasksSql = `
        SELECT *
        FROM tasks
        WHERE user_id = ?
          AND due_date = ?
    `;

  db.all(activitiesSql, [userId, date], (err, activities) => {

    if (err) return callback(err);

    db.all(tasksSql, [userId, date], (err, tasks) => {

      if (err) return callback(err);

      callback(null, {
        activities,
        tasks
      });

    });

  });

}

module.exports = {
  getCalendarData,
  getDayData,
};
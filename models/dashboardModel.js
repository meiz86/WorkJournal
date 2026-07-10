const db = require("../database/db");

function getStatistics(callback) {
  const sql = `
        SELECT
            COUNT(*) AS totalActivities,

            SUM(
                CASE
                    WHEN activity_date = DATE('now')
                    THEN 1
                    ELSE 0
                END
            ) AS todayActivities,

            SUM(duration) AS totalMinutes

        FROM activities
    `;

  db.get(sql, [], (err, row) => {
    callback(err, row);
  });
}

module.exports = {
  getStatistics,
};

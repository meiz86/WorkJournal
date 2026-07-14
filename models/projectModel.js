const db = require("../database/db");

// ============================
// Get all projects
// ============================

function getAll(userId, callback) {
  const sql = `
    SELECT
      p.id,
      p.user_id,
      p.name,
      p.client,
      p.description,
      p.color,
      p.start_date,
      p.end_date,
      p.status,
      p.is_active,
      p.created_at,

      IFNULL(a.activity_count,0) AS activity_count,
      IFNULL(a.total_minutes,0) AS total_minutes,
      IFNULL(a.last_activity,'-') AS last_activity,

      IFNULL(t.task_count,0) AS task_count

    FROM projects p

    LEFT JOIN (
      SELECT
        project_id,
        COUNT(*) AS activity_count,
        SUM(duration) AS total_minutes,
        MAX(date) AS last_activity
      FROM activities
      GROUP BY project_id
    ) a
      ON p.id = a.project_id

    LEFT JOIN (
      SELECT
        project_id,
        COUNT(*) AS task_count
      FROM tasks
      GROUP BY project_id
    ) t
      ON p.id = t.project_id

    WHERE p.user_id = ?
      AND p.is_active = 1

    ORDER BY p.name
  `;

  db.all(sql, [userId], callback);
}

// ============================
// Get project by ID
// ============================

function getById(id, userId, callback) {
  db.get(
    `
    SELECT *
    FROM projects
    WHERE id = ?
      AND user_id = ?
    `,
    [id, userId],
    callback
  );
}

// ============================
// Create project
// ============================

function create(project, callback) {
  const sql = `
    INSERT INTO projects
    (
      user_id,
      name,
      client,
      description,
      color,
      start_date,
      end_date,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      project.user_id,
      project.name,
      project.client,
      project.description,
      project.color,
      project.start_date,
      project.end_date,
      project.status,
    ],
    callback
  );
}

// ============================
// Update project
// ============================

function update(id, userId, project, callback) {
  const sql = `
    UPDATE projects
    SET
      name = ?,
      client = ?,
      description = ?,
      color = ?,
      start_date = ?,
      end_date = ?,
      status = ?
    WHERE id = ?
      AND user_id = ?
  `;

  db.run(
    sql,
    [
      project.name,
      project.client,
      project.description,
      project.color,
      project.start_date,
      project.end_date,
      project.status,
      id,
      userId,
    ],
    callback
  );
}

// ============================
// Soft Delete
// ============================

function remove(id, userId, callback) {
  db.run(
    `
    UPDATE projects
    SET is_active = 0
    WHERE id = ?
      AND user_id = ?
    `,
    [id, userId],
    callback
  );
}

// ============================
// Project Dashboard
// ============================

function getDashboard(id, userId, callback) {
  const sql = `
    SELECT
      p.*,

      COUNT(DISTINCT a.id) AS totalActivities,
      COUNT(DISTINCT t.id) AS totalTasks,

      IFNULL(SUM(a.duration),0) AS totalMinutes,

      SUM(
        CASE
          WHEN t.status='Completed'
          THEN 1
          ELSE 0
        END
      ) AS completedTasks

    FROM projects p

    LEFT JOIN activities a
      ON a.project_id = p.id

    LEFT JOIN tasks t
      ON t.project_id = p.id

    WHERE p.id = ?
      AND p.user_id = ?

    GROUP BY p.id
  `;

  db.get(sql, [id, userId], (err, project) => {
    if (err) return callback(err);

    if (!project) return callback(null, null);

    db.all(
      `
      SELECT
        date,
        activity,
        duration
      FROM activities
      WHERE project_id = ?
        AND user_id = ?
      ORDER BY date DESC
      LIMIT 5
      `,
      [id, userId],
      (err, activities) => {
        if (err) return callback(err);

        db.all(
          `
          SELECT
            title,
            due_date,
            priority,
            status
          FROM tasks
          WHERE project_id = ?
            AND user_id = ?
          ORDER BY due_date
          LIMIT 5
          `,
          [id, userId],
          (err, tasks) => {
            if (err) return callback(err);

            callback(null, {
              project,
              activities,
              tasks,
            });
          }
        );
      }
    );
  });
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getDashboard,
};
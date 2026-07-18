const db = require("../database/db");

// ============================
// Get All Tasks
// ============================

function getAllTasks(userId, callback) {
  const sql = `
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

    ORDER BY t.due_date ASC
  `;

  db.all(sql, [userId], callback);
}

// ============================
// Create Task
// ============================

function createTask(task, callback) {
  const sql = `
    INSERT INTO tasks
    (
      user_id,
      project_id,
      department_id,
      title,
      description,
      priority,
      status,
      due_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      task.user_id,
      task.project_id,
      task.department_id,
      task.title,
      task.description,
      task.priority,
      task.status,
      task.due_date,
    ],
    callback,
  );
}

// ============================
// Upcoming Tasks
// ============================

function getUpcomingTasks(userId, limit, callback) {
  const sql = `
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
      AND t.status != 'Completed'

    ORDER BY t.due_date ASC

    LIMIT ?
  `;

  db.all(sql, [userId, limit], callback);
}

// ============================
// Get Task By ID
// ============================

function getTaskById(id, userId, callback) {
  const sql = `
    SELECT
      t.*,
      p.name AS project,
      d.name AS department

    FROM tasks t

    LEFT JOIN projects p
      ON p.id = t.project_id

    LEFT JOIN departments d
      ON d.id = t.department_id

    WHERE t.id = ?
      AND t.user_id = ?
  `;

  db.get(sql, [id, userId], callback);
}

// ============================
// Update Task
// ============================

function updateTask(id, userId, task, callback) {
  const sql = `
    UPDATE tasks
    SET
      project_id = ?,
      department_id = ?,
      title = ?,
      description = ?,
      priority = ?,
      status = ?,
      due_date = ?
    WHERE id = ?
      AND user_id = ?
  `;

  db.run(
    sql,
    [
      task.project_id,
      task.department_id,
      task.title,
      task.description,
      task.priority,
      task.status,
      task.due_date,
      id,
      userId,
    ],
    callback,
  );
}

// ============================
// Complete Task
// ============================

function completeTask(id, userId, callback) {
  db.run(
    `
      UPDATE tasks
      SET status = 'Completed'
      WHERE id = ?
        AND user_id = ?
    `,
    [id, userId],
    callback,
  );
}

// ============================
// Delete Task
// ============================

function deleteTask(id, userId, callback) {
  db.run(
    `
      DELETE FROM tasks
      WHERE id = ?
        AND user_id = ?
    `,
    [id, userId],
    callback,
  );
}

module.exports = {
  getAllTasks,
  createTask,
  getUpcomingTasks,
  getTaskById,
  updateTask,
  completeTask,
  deleteTask,
};

const db = require("../database/db");

function getAllTasks(userId, callback) {
  const sql = `
    SELECT *
    FROM tasks
    WHERE user_id = ?
    ORDER BY due_date ASC
  `;

  db.all(sql, [userId], callback);
}

function createTask(task, callback) {
  const sql = `
    INSERT INTO tasks
    (
      user_id,
      title,
      description,
      project,
      department,
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
      task.title,
      task.description,
      task.project,
      task.department,
      task.priority,
      task.status,
      task.due_date,
    ],
    callback,
  );
}

function getUpcomingTasks(userId, limit, callback) {
  const sql = `
    SELECT *
    FROM tasks
    WHERE user_id = ?
      AND status != 'Completed'
    ORDER BY due_date ASC
    LIMIT ?
  `;

  db.all(sql, [userId, limit], callback);
}

function getTaskById(id, userId, callback) {
  const sql = `
        SELECT *
        FROM tasks
        WHERE id = ?
        AND user_id = ?
    `;

  db.get(sql, [id, userId], callback);
}
function updateTask(id, userId, task, callback) {
  const sql = `
    UPDATE tasks
    SET
      title = ?,
      description = ?,
      project = ?,
      department = ?,
      priority = ?,
      status = ?,
      due_date = ?
    WHERE id = ?
      AND user_id = ?
  `;

  db.run(
    sql,
    [
      task.title,
      task.description,
      task.project,
      task.department,
      task.priority,
      task.status,
      task.due_date,
      id,
      userId,
    ],
    callback,
  );
}

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

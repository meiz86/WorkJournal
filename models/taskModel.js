const db = require("../database/db");

function getAllTasks(callback) {
  const sql = `
        SELECT *
        FROM tasks
        ORDER BY due_date ASC
    `;

  db.all(sql, [], callback);
}

function createTask(task, callback) {
  const sql = `
        INSERT INTO tasks
        (
            title,
            description,
            project,
            department,
            priority,
            status,
            due_date
        )
        VALUES (?,?,?,?,?,?,?)
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
    ],
    callback,
  );
}

function getUpcomingTasks(limit, callback) {
  const sql = `
        SELECT *
        FROM tasks
        WHERE status != 'Completed'
        ORDER BY due_date ASC
        LIMIT ?
    `;

  db.all(sql, [limit], callback);
}
function getTaskById(id, callback) {
  db.get("SELECT * FROM tasks WHERE id = ?", [id], callback);
}
function updateTask(id, task, callback) {
  const sql = `
        UPDATE tasks
        SET
            title=?,
            description=?,
            project=?,
            department=?,
            priority=?,
            status=?,
            due_date=?
        WHERE id=?
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
    ],
    callback,
  );
}
function completeTask(id, callback) {
  db.run(
    "UPDATE tasks SET status='Completed' WHERE id=?",

    [id],

    callback,
  );
}
function deleteTask(id, callback) {
  db.run(
    "DELETE FROM tasks WHERE id=?",

    [id],

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

const Task = require("../models/taskModel");

exports.index = (req, res) => {
  Task.getAllTasks((err, tasks) => {
    if (err) return res.send(err.message);

    res.render("tasks/index", {
      title: "Tasks",

      tasks,
    });
  });
};

exports.showForm = (req, res) => {
  res.render("tasks/new", {
    title: "New Task",
  });
};

exports.create = (req, res) => {
  Task.createTask(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/tasks");
  });
};

exports.editForm = (req, res) => {
  Task.getTaskById(req.params.id, (err, task) => {
    if (err) return res.send(err.message);

    res.render("tasks/edit", {
      title: "Edit Task",

      task,
    });
  });
};
exports.update = (req, res) => {
  Task.updateTask(
    req.params.id,

    req.body,

    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/tasks");
    },
  );
};
exports.complete = (req, res) => {
  Task.completeTask(
    req.params.id,

    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/tasks");
    },
  );
};
exports.delete = (req, res) => {
  Task.deleteTask(
    req.params.id,

    (err) => {
      if (err) return res.send(err.message);

      res.redirect("/tasks");
    },
  );
};

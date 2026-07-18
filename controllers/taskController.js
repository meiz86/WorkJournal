const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const Department = require("../models/departmentModel");

exports.index = (req, res) => {
  Task.getAllTasks(req.session.user.id, (err, tasks) => {
    if (err) return res.send(err.message);

    res.render("tasks/index", {
      title: "Tasks",
      tasks,
    });
  });
};

exports.showForm = (req, res) => {
  Project.getAll(req.session.user.id, (err, projects) => {
    if (err) return res.send(err.message);

    Department.getAll((err, departments) => {
      if (err) return res.send(err.message);

      res.render("tasks/new", {
        title: "New Task",
        projects,
        departments,
      });
    });
  });
};

exports.create = (req, res) => {
  req.body.user_id = req.session.user.id;
  req.body.project_id = parseInt(req.body.project_id);
  req.body.department_id = parseInt(req.body.department_id);

  Task.createTask(req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/tasks");
  });
};

exports.editForm = (req, res) => {
  Task.getTaskById(req.params.id, req.session.user.id, (err, task) => {
    if (err) return res.send(err.message);

    if (!task) {
      return res.status(404).send("Task not found.");
    }

    Project.getAll(req.session.user.id, (err, projects) => {
      if (err) return res.send(err.message);

      Department.getAll((err, departments) => {
        if (err) return res.send(err.message);

        res.render("tasks/edit", {
          title: "Edit Task",
          task,
          projects,
          departments,
        });
      });
    });
  });
};

exports.update = (req, res) => {
  req.body.project_id = parseInt(req.body.project_id);
  req.body.department_id = parseInt(req.body.department_id);

  Task.updateTask(req.params.id, req.session.user.id, req.body, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/tasks");
  });
};
exports.complete = (req, res) => {
  Task.completeTask(req.params.id, req.session.user.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/tasks");
  });
};

exports.delete = (req, res) => {
  Task.deleteTask(req.params.id, req.session.user.id, (err) => {
    if (err) return res.send(err.message);

    res.redirect("/tasks");
  });
};
